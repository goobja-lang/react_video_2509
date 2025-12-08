// src/components/VideoThumbnail.tsx (파일 경로 예시)
import React from "react";
import useVideoThumbnail from "../utils/useVideoThumbnail"; // 경로에 맞게 수정

interface VideoThumbnailProps {
  url: string;
  title: string;
}

const VideoThumbnail: React.FC<VideoThumbnailProps> = ({ url, title }) => {
  // Custom Hook을 사용하여 썸네일 URL 가져오기
  const thumbnailUrl = useVideoThumbnail(url);

  if (!url) {
    return <span>URL 없음</span>;
  }

  if (!thumbnailUrl) {
    return (
      <div
        style={{
          width: "150px",
          height: "80px",
          backgroundColor: "#eee",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "10px",
        }}
      >
        썸네일 로딩 중...
      </div>
    );
  }

  return (
    <img
      src={thumbnailUrl}
      alt={`${title} 썸네일`}
      style={{
        width: "150px", // 크기 조정 가능
        height: "80px",
        objectFit: "cover",
        borderRadius: "4px",
        marginRight: "15px",
        cursor: "pointer", // 클릭 가능함을 암시
      }}
    />
  );
};

export default VideoThumbnail;
