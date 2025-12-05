import { useEffect, useState } from "react";

// TBoard는 필요 없으므로 TBoard가 아닌 TVideo 타입으로 가정합니다.
interface t_video {
  id: number;
  hlsStreamingUrl: string;
  mp4Url: string;
  // 필요한 다른 필드들...
}

export default function Home() {
  // 1. 비디오 리스트를 저장할 상태(State) 생성
  const [videoList, setVideoList] = useState<t_video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 2. API 호출 함수 구현
  async function getVideoList() {
    setLoading(true); // 로딩 시작
    setError(null); // 에러 초기화
    try {
      // 💡 백엔드 서버 주소와 엔드포인트에 맞게 URL을 수정해주세요.
      const response = await fetch(
        "http://localhost:7860/api/video/get_video_list",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            // 인증이 필요한 경우 토큰을 여기에 추가합니다.
            // "Authorization": `Bearer ${yourToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        // API 응답의 data 필드가 비디오 배열이라고 가정합니다.
        setVideoList(result.data || []);
      } else {
        throw new Error(
          result.msg || "비디오 목록을 가져오는 데 실패했습니다."
        );
      }
    } catch (err: any) {
      console.error("Fetch Error:", err);
      setError(err.message || "알 수 없는 에러 발생");
    } finally {
      setLoading(false); // 로딩 종료
    }
  }

  // 3. 컴포넌트 마운트 시 API 호출
  useEffect(() => {
    getVideoList();
  }, []); // 빈 배열: 컴포넌트가 처음 렌더링될 때만 실행

  // 4. 로딩 및 에러 상태 처리
  if (loading) {
    return (
      <div className="content-margin-padding">
        <h1>비디오 리스트</h1>
        <p>로딩 중...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="content-margin-padding">
        <h1>비디오 리스트</h1>
        <p style={{ color: "red" }}>에러 발생: {error}</p>
      </div>
    );
  }

  // 5. 비디오 리스트 렌더링
  return (
    <div className="content-margin-padding">
      <h1>비디오 리스트 ({videoList.length}개)</h1>

      {videoList.length === 0 ? (
        <p>표시할 비디오가 없습니다.</p>
      ) : (
        <div className="video-grid">
          {videoList.map((video) => (
            // key prop은 리스트 렌더링 시 필수입니다.
            <div key={video.id} className="video-item">
              <h2>비디오 #{video.id}</h2>
              <p>
                MP4 URL:{" "}
                <a href={video.mp4Url} target="_blank">
                  {video.mp4Url}
                </a>
              </p>

              {/* 비디오 태그를 사용하여 실제로 비디오를 표시합니다. */}
              {video.mp4Url && (
                <video
                  controls
                  width="100%"
                  height="auto"
                  src={video.mp4Url}
                  poster="/thumbnail.jpg" // 썸네일 경로가 있다면 사용
                >
                  브라우저가 비디오 재생을 지원하지 않습니다.
                </video>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
