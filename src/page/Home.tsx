// Home.tsx (수정된 파일)
import { useEffect, useState } from "react";
// 1. ✨ 새로 만든 썸네일 컴포넌트를 import 합니다.
import VideoThumbnail from "../component/VideoThumbnail";

interface videoListType {
  createdAt?: string;
  id?: number;
  mp4Url?: string; // 비디오 URL
  publicId?: string;
  title?: string;
}
export default function Home() {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [videos, setVideos] = useState<videoListType[]>([]);

  async function getVideoList() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/video/get_video_list`);
      const result: any = await response.json();
      if (!result?.success) {
        alert(`서버 에러. ${result?.msg ?? ""}`);
        return;
      }
      setVideos(result?.data ?? []);
    } catch (error: any) {
      alert(`서버 에러. ${error?.message ?? ""}`);
      return;
    }
  }

  useEffect(() => {
    getVideoList();
  }, []);

  return (
    <div className="content-margin-padding">
      <h1>VIDEO LIST</h1>
      <div>
        {videos?.length &&
          videos.map((item) => {
            return (
              <div
                key={item?.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "10px",
                }}
              >
                {/* 2. ✨ VideoThumbnail 컴포넌트를 추가하고 mp4Url을 전달합니다. */}
                {item?.mp4Url && (
                  <VideoThumbnail
                    url={item.mp4Url}
                    title={item?.title ?? "제목 없음"}
                  />
                )}

                {/* 기존 텍스트 정보 */}
                <span>
                  {item?.id}, &nbsp;&nbsp; {item?.title ?? ""}
                  ,&nbsp;&nbsp; {item?.createdAt ?? ""}
                </span>
              </div>
            );
          })}
      </div>
    </div>
  );
}
