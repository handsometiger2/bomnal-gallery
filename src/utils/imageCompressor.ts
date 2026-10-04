/**
 * High-efficiency Image Compressor for Cloud Firestore
 * Resizes and compresses user-uploaded photos to prevent exceeding Firestore document limits (1MB)
 * while preserving high fidelity for architectural / interior portfolio viewing.
 */
export async function compressImageFile(file: File, isThumbnail = false): Promise<string> {
  const maxDim = isThumbnail ? 800 : 1024;
  const initialQuality = isThumbnail ? 0.55 : 0.60;

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('파일을 읽는 중 오류가 발생했습니다.'));
    reader.onload = (e) => {
      const srcData = e.target?.result as string;
      if (!srcData) {
        reject(new Error('빈 이미지 데이터입니다.'));
        return;
      }

      const img = new Image();
      img.onerror = () => reject(new Error('지원하지 않는 이미지 형식이거나 손상된 파일입니다.'));
      img.onload = () => {
        try {
          let width = img.width;
          let height = img.height;

          // Scale down maintaining aspect ratio
          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(srcData);
            return;
          }

          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, width, height);
          ctx.drawImage(img, 0, 0, width, height);

          // First pass
          let dataUrl = canvas.toDataURL('image/jpeg', initialQuality);

          // If still over 80KB (approx 105,000 base64 chars), run second pass
          if (dataUrl.length > 105000) {
            const secondCanvas = document.createElement('canvas');
            const scale = 0.85;
            const w2 = Math.round(width * scale);
            const h2 = Math.round(height * scale);
            secondCanvas.width = w2;
            secondCanvas.height = h2;
            const ctx2 = secondCanvas.getContext('2d');
            if (ctx2) {
              ctx2.fillStyle = '#FFFFFF';
              ctx2.fillRect(0, 0, w2, h2);
              ctx2.drawImage(img, 0, 0, w2, h2);
              dataUrl = secondCanvas.toDataURL('image/jpeg', 0.48);
            }
          }

          resolve(dataUrl);
        } catch (err) {
          reject(err);
        }
      };
      img.src = srcData;
    };
    reader.readAsDataURL(file);
  });
}
