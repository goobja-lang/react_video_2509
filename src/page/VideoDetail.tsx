import { useEffect, useState } from "react";
import { useAuthStore } from "../store/authStore";
import { useShallow } from "zustand/shallow";
import { useNavigate, useSearchParams } from "react-router-dom";

interface videoType {
  createdAt?: string;
  id?: number;
  mp4Url?: string; // 비디오 URL
  publicId?: string;
  title?: string;
  encvideo?: any;
}
export default function VideoDetail() {
  // 1. 상태 읽기 (READ)
  // useAuthStore 훅을 통해 현재 상태에서 userInfo를 가져옵니다.
  // 이 방법은 상태가 바뀔 때만 리렌더링됩니다.
  const userInfo = useAuthStore((state: any) => state.userInfo);

  // 2. 액션 함수 가져오기 (SET을 위한 함수)
  const { login, logout } = useAuthStore(
    useShallow((state: any) => ({
      login: state?.login,
      logout: state?.logout,
    }))
  );
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const videoId = Number(searchParams?.get("videoId") ?? 0);
  const [video, setVideo] = useState<videoType>({});

  async function getVideo() {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/video/get_video_by_id?video_id=${videoId}`
      );
      const result: any = await response.json();
      if (!result?.success) {
        alert(`서버 에러. ${result?.msg ?? ""}`);
        return;
      }
      setVideo(result?.data ?? {});
    } catch (error: any) {
      alert(`서버 에러. ${error?.message ?? ""}`);
      return;
    }
  }

  useEffect(() => {
    getVideo();
  }, [videoId]);

  return (
    <div>
      <div>비디오 상세보기, ${videoId}</div>
      <div>제목 : ${video?.title}</div>
      <div>encvideo: {JSON.stringify(video?.encvideo)}</div>
      <div>
        <video
          src={`${API_BASE_URL}/api/video/get_encvideo?encvideo=${JSON.stringify(
            video?.encvideo
          )}`}
          controls={true}
        />
      </div>
    </div>
  );
}
