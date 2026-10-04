/**
 * High-efficiency Image Compressor for Cloud Firestore
 * Resizes and compresses user-uploaded photos to prevent exceeding Firestore document limits (1MB)
 * while preserving crystal-clear fidelity for architectural / interior portfolio viewing.
 */

export type CompressMode = 'thumbnail' | 'photo' | 'hero';

export async function compressImageFile(
  file: File,
  modeOrIsThumbnail: CompressMode | boolean = 'photo'
): Promise<string> {
  const mode: CompressMode =
    typeof modeOrIsThumbnail === 'boolean'
      ? (modeOrIsThumbnail ? 'thumbnail' : 'photo')
      : modeOrIsThumbnail;

  // Mode settings:
  // - 'hero' (메인 전체화면 배경): 가로 최대 2560px(QHD/FHD), 화질 82% 유지 (단독 문서이므로 초고화질 보장)
  // - 'photo' (아파트 공간별 사진): 1024px, 화질 60%
  // - 'thumbnail' (목록 썸네일): 800px, 화질 55%
  let maxDim = 1024;
  let initialQuality = 0.60;
  let sizeCap = 105000; // ~80KB

  if (mode === 'hero') {
    maxDim = 2560;
    initialQuality = 0.82;
    sizeCap = 900000; // ~680KB (Firestore 1MB 한도 내 초고화질)
  } else if (mode === 'thumbnail') {
    maxDim = 800;
    initialQuality = 0.55;
    sizeCap = 90000;
  }

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

          // Smooth high-quality scaling
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, width, height);
          ctx.drawImage(img, 0, 0, width, height);

          // First pass
          let dataUrl = canvas.toDataURL('image/jpeg', initialQuality);

          // If still over sizeCap, perform gentle second pass
          if (dataUrl.length > sizeCap) {
            const secondCanvas = document.createElement('canvas');
            const scale = mode === 'hero' ? 0.90 : 0.85;
            const w2 = Math.round(width * scale);
            const h2 = Math.round(height * scale);
            secondCanvas.width = w2;
            secondCanvas.height = h2;
            const ctx2 = secondCanvas.getContext('2d');
            if (ctx2) {
              ctx2.imageSmoothingEnabled = true;
              ctx2.imageSmoothingQuality = 'high';
              ctx2.fillStyle = '#FFFFFF';
              ctx2.fillRect(0, 0, w2, h2);
              ctx2.drawImage(img, 0, 0, w2, h2);
              dataUrl = secondCanvas.toDataURL('image/jpeg', mode === 'hero' ? 0.75 : 0.48);
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
