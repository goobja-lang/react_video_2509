import { useEffect, useState } from "react";

export default function Register() {
  /* inputVal 이라는 바인딩 변수랑 set 함수 만들어 주세요.
  타입은 string */
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  useEffect(() => {}, []);

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
          <button onClick={}>회원가입</button>
        </div>
      </div>
    </div>
  );
}
