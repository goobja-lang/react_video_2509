import "./Header.css";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { useShallow } from "zustand/shallow";
import React from "react";

export default function Header() {
  const userInfo = useAuthStore((state) => state?.userInfo);
  const { login, logout } = useAuthStore(
    useShallow((state) => ({
      login: state.login,
      logout: state.logout,
    }))
  );
  const navigate = useNavigate();
  const location = useLocation();

  const isImgTestPage = location.pathname === "/imgtest";

  return (
    <div>
      {/* 1. 메인 헤더 (로고 - 메뉴 - 로그인정보 한 줄 배치) */}
      <header>
        {/* 로고 영역 */}
        <h1 className="logo" onClick={() => navigate("/")}>
          LOGO
        </h1>

        {/* 네비게이션 메뉴 영역 */}
        <nav>
          <ul className="topnav">
            <li>
              <Link
                to="/"
                className={location.pathname === "/" ? "active" : ""}
              >
                HOME
              </Link>
            </li>

            <li>
              <Link
                to="/video_upload"
                className={
                  location.pathname === "/video_uplaod" ? "active" : ""
                }
              >
                VIDEO UPLOAD
              </Link>
            </li>
          </ul>
        </nav>

        {/* 우측 로그인/유저 정보 영역 */}
        <div className="header-right">
          {userInfo?.id ? (
            <>
              <span className="user-info">
                {userInfo?.displayName ?? "User"}
              </span>
              <button
                className="auth-button"
                onClick={() => {
                  logout();
                  navigate("/");
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <button
              className="auth-button"
              onClick={() => {
                navigate("/login");
              }}
            >
              Login
            </button>
          )}
        </div>
      </header>

      {/* 2. 서브 메뉴 (헤더 바로 아래 위치) */}
      {isImgTestPage && (
        <ul className="subnav">
          <li>
            <Link to="/imgtest?model=base">기본 모델</Link>
          </li>
          <li>
            <Link to="/imgtest?model=muffin_chihuahua">치와와vs머핀</Link>
          </li>
          <li>
            <Link to="/imgtest?model=plantdisease">식물병충해</Link>
          </li>
        </ul>
      )}
    </div>
  );
}
