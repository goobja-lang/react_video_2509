// src/hooks/useVideoThumbnail.ts (파일 경로 예시)
import { useState, useEffect } from "react";

const useVideoThumbnail = (
  videoUrl: string,
  timeToCapture: number = 0.5
): string | null => {
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);

  useEffect(() => {
    setThumbnailUrl(null); // URL이 변경될 때마다 초기화
    if (!videoUrl) return;

    const video = document.createElement("video");
    video.src = videoUrl;
    // ⚠️ CORS 이슈를 피하기 위해 서버에서 적절한 헤더를 허용해야 합니다.
    video.crossOrigin = "anonymous";
    video.muted = true;
    video.preload = "auto";

    const handleLoadedMetadata = () => {
      // 캡처할 시간으로 이동
      video.currentTime = timeToCapture;
    };

    // 비디오가 원하는 시간대로 이동(seek)을 완료했을 때 캡처 실행
    const handleSeeked = () => {
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");

      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataURL = canvas.toDataURL("image/jpeg");
        setThumbnailUrl(dataURL);
      }

      // 이벤트 리스너 제거 및 메모리 정리
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      video.removeEventListener("seeked", handleSeeked);
    };

    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    video.addEventListener("seeked", handleSeeked);
    video.load();

    return () => {
      // 컴포넌트 정리 시 이벤트 리스너 제거
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      video.removeEventListener("seeked", handleSeeked);
      video.src = "";
    };
  }, [videoUrl, timeToCapture]);

  return thumbnailUrl;
};

export default useVideoThumbnail;
