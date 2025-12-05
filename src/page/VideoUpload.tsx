import { useEffect, useState } from "react";
import VideoUploaderCompo from "../component/VideoUploaderCompo";
import { useAuthStore } from "../store/authStore";
import { useShallow } from "zustand/shallow";
import { useNavigate } from "react-router-dom";
import * as utils from "../utils/utils";

export default function VideoUpload() {
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

  async function validation() {
    let result = await utils.verify_token(userInfo?.token ?? "");
    if (result.includes("인증실패")) {
      alert(`${result}. 로그인을 다시 해주세요.`);
      logout();
      navigate("/login");
    }
  }

  useEffect(() => {
    validation();
  }, []);

  return (
    <div>
      <div>
        <VideoUploaderCompo />
      </div>
    </div>
  );
}
