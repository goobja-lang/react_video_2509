import { useEffect, useState } from "react";
import { useAuthStore } from "../store/authStore";
import { useShallow } from "zustand/shallow";
import { useNavigate } from "react-router-dom";

export default function Register() {
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
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  useEffect(() => {}, []);

  async function onRegister() {
    /* 회원가입 기능 넣기 */
    const formData = new FormData();
    formData.append("username", String(username));
    formData.append("password", String(password));
    const response = await fetch(`${API_BASE_URL}/api/user/register`, {
      method: "POST",
      body: formData,
      headers: {
        Authorization: "",
      },
    });
    let result: any = await response.json(); // 서버 응답을 JSON으로 파싱
    if (!result?.success) {
      alert(`로그인 실패. ${result?.msg}`);
      return;
    }

    let userInfo = result?.data?.userInfo ?? "";
    let token = result?.data?.token ?? "";
    if (!userInfo?.id || !token) {
      alert(`로그인 실패. 서버에서 중요정보 안보냄 ${result?.msg}`);
      return;
    }
    const fullUserInfo = {
      ...userInfo, // id, username, email 등
      token: token, // 토큰 추가
    };

    login(fullUserInfo);
    navigate("/");
  }

  return (
    <div className="content-margin-padding">
      <div>
        <input
          value={username}
          onChange={(event) => {
            let input_value = event?.target?.value ?? "";
            // 숫자와 +, -, *, /, % 만 허용하는 정규식

            setUsername(input_value);
          }}
        />
        <input
          value={password}
          onChange={(event) => {
            let input_value = event?.target?.value ?? "";
            // 숫자와 +, -, *, /, % 만 허용하는 정규식

            setPassword(input_value);
          }}
        />
        <div>
          <button onClick={onRegister}>회원가입</button>
        </div>
      </div>
    </div>
  );
}
