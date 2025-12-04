import { useEffect, useState } from "react";
import { useAuthStore } from "../store/authStore"; // zustand 스토어 import
import { useShallow } from "zustand/shallow"; // 얕은 비교를 위한 useShallow import
import { useNavigate } from "react-router-dom"; // 페이지 이동을 위한 useNavigate import

export default function Login() {
  // 1. zustand 스토어에서 액션 함수 가져오기 (SET을 위한 함수)
  const { login } = useAuthStore(
    useShallow((state: any) => ({
      login: state?.login, // 로그인 액션 함수
    }))
  );

  // 환경 변수에서 API 기본 URL 가져오기
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // React 훅 초기화
  const navigate = useNavigate(); // 페이지 이동 훅
  const [username, setUsername] = useState<string>(""); // 사용자 이름 상태
  const [password, setPassword] = useState<string>(""); // 비밀번호 상태
  const [error, setError] = useState<string | null>(null); // 에러 메시지 상태

  /* --- 기존 코드에서 남겨진 불필요한 부분 제거 (Login.tsx 원본 파일에 있던 계산기 로직) --- */
  // const [inputVal, setinputVal] = useState<string>("");
  // const [evalResult, setevalResult] = useState<string>("");
  // let dummy = "hello";
  // useEffect(() => {
  //   dummy = "bye";
  // }, []);
  // function onInputEnter(event: React.KeyboardEvent) { ... }
  /* -------------------------------------------------------------------------------------- */

  // useEffect는 현재 로그인 컴포넌트에서는 특별히 할 일이 없으므로 비워둡니다.
  useEffect(() => {}, []);

  /**
   * @function onLogin
   * @description 로그인 버튼 클릭 시 실행되는 함수
   */
  async function onLogin() {
    /* 로그인 기능 구현 */
    const formData = new FormData();
    formData.append("username", String(username));
    formData.append("password", String(password));

    // API 호출 (Register.tsx와 유사한 형태)
    const response = await fetch(`${API_BASE_URL}/api/user/login`, {
      method: "POST",
      body: formData,
      headers: {
        Authorization: "", // 로그인 시에는 토큰이 없으므로 비워둡니다.
      },
    });

    let result: any = await response.json(); // 서버 응답을 JSON으로 파싱

    // 응답 성공 여부 확인
    if (!result?.success) {
      alert(`로그인 실패. ${result?.msg}`);
      setError(`로그인 실패: ${result?.msg}`); // 에러 상태 업데이트
      return;
    }

    // 서버 응답에서 사용자 정보와 토큰 추출
    let userInfo = result?.data?.userInfo ?? "";
    let token = result?.data?.token ?? "";

    // 필수 정보 누락 확인
    if (!userInfo?.id || !token) {
      alert(
        `로그인 실패. 서버에서 중요정보(ID 또는 토큰)를 안 보냈습니다. ${result?.msg}`
      );
      setError("로그인 실패: 서버 응답에 필수 정보 누락");
      return;
    }

    // 최종 사용자 정보 객체 생성
    const fullUserInfo = {
      ...userInfo, // id, username, email 등
      token: token, // 토큰 추가
    };

    // zustand 스토어의 login 액션 함수 호출하여 전역 상태 업데이트
    login(fullUserInfo);

    // 로그인 성공 후 메인 페이지로 이동
    navigate("/");
  }

  return (
    <div className="content-margin-padding">
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          maxWidth: "300px",
          margin: "0 auto",
        }}
      >
        <h3>로그인</h3>
        {/* 사용자 이름 입력 필드 */}
        <input
          type="text"
          placeholder="사용자 이름 (Username)"
          value={username}
          onChange={(event) => {
            setUsername(event?.target?.value ?? "");
          }}
          style={{
            padding: "8px",
            border: "1px solid #ccc",
            borderRadius: "4px",
          }}
        />
        {/* 비밀번호 입력 필드 */}
        <input
          type="password"
          placeholder="비밀번호 (Password)"
          value={password}
          onChange={(event) => {
            setPassword(event?.target?.value ?? "");
          }}
          style={{
            padding: "8px",
            border: "1px solid #ccc",
            borderRadius: "4px",
          }}
        />
        <div style={{ marginTop: "10px" }}>
          {/* 로그인 버튼 */}
          <button
            onClick={onLogin}
            style={{
              padding: "10px 15px",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              width: "100%",
            }}
          >
            로그인
          </button>
        </div>
        {/* 에러 메시지 표시 */}
        {error && (
          <div style={{ color: "red", marginTop: "10px" }}>{error}</div>
        )}
      </div>
    </div>
  );
}
