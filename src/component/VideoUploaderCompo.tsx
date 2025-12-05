import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { useShallow } from "zustand/shallow";

const VideoUploaderCompo: React.FC = () => {
  /** authStore 에서 유저 정보 가져오는 코드 붙여넣기 */
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
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [title, setTitle] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // 1. 파일 선택 핸들러
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];

    if (selectedFile) {
      // 비디오 파일인지 검증 (선택 사항)
      if (!selectedFile.type.startsWith("video/")) {
        alert("비디오 파일만 선택해주세요.");
        return;
      }

      setFile(selectedFile);

      // 미리보기 URL 생성
      const fileUrl = URL.createObjectURL(selectedFile);
      setPreviewUrl(fileUrl);
    }
  };

  // 2. 업로드 핸들러
  const handleUpload = async () => {
    if (!file) {
      alert("업로드할 파일을 선택해주세요.");
      return;
    }

    setUploading(true);

    // FormData 생성 (핵심)
    const formData = new FormData();
    formData.append("videoFile", file); // 'video'는 백엔드에서 받는 key값과 일치해야 함

    try {
      const response = await fetch(`${API_BASE_URL}/api/video/upload_video`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${userInfo?.token ?? ""}`,
        },
        body: formData,
        // 주의: Content-Type 헤더를 직접 설정하지 마세요. 브라우저가 자동으로 boundary를 설정합니다.
      });

      const result: any = await response.json();
      if (!result?.success) {
        alert(`서버 에러 ${result?.msg ?? ""}`);
        return `서버 에러 ${result?.msg ?? ""}`;
      }

      console.log("업로드 성공:", file.name);
      alert("업로드 성공!");
      navigate("/");
    } catch (error) {
      console.error("업로드 실패:", error);
      alert("업로드 중 오류가 발생했습니다.");
    } finally {
      setUploading(false);
    }
  };

  // 3. 초기화 핸들러
  const handleClear = () => {
    setFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    // 메모리 누수 방지를 위해 URL 해제
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
  };

  return (
    <div
      style={{ padding: "20px", border: "1px solid #ddd", borderRadius: "8px" }}
    >
      <h2>비디오 업로드</h2>
      <div>
        <input
          placeholder="제목"
          onChange={(e) => {
            setTitle(e?.target?.value ?? "");
          }}
        />
      </div>

      {/* 파일 입력 */}
      <input
        type="file"
        accept="video/*"
        onChange={handleFileChange}
        ref={fileInputRef}
        style={{ marginBottom: "20px" }}
      />

      {/* 미리보기 영역 */}
      {previewUrl && (
        <div style={{ marginBottom: "20px" }}>
          <p>미리보기:</p>
          <video
            src={previewUrl}
            controls
            width="400"
            style={{ borderRadius: "8px" }}
          />
        </div>
      )}

      {/* 버튼 영역 */}
      <div style={{ display: "flex", gap: "10px" }}>
        <button
          onClick={handleUpload}
          disabled={!file || uploading}
          style={{ padding: "10px 20px", cursor: "pointer" }}
        >
          {uploading ? "업로드 중..." : "업로드 하기"}
        </button>

        {file && (
          <button
            onClick={handleClear}
            disabled={uploading}
            style={{
              padding: "10px 20px",
              cursor: "pointer",
              backgroundColor: "#f44336",
              color: "white",
              border: "none",
            }}
          >
            취소
          </button>
        )}
      </div>
    </div>
  );
};

export default VideoUploaderCompo;
