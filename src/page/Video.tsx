import React, { useEffect, useState } from "react";
// 1. 컴포넌트 import (경로 주의: ../component/파일명)
import VideoUploaderCompo from "../component/VideoUploaderCompo";

export default function Video() {
  return (
    <div className="content-margin-padding">
      <div>
        {/* 2. 컴포넌트 장착 */}
        <VideoUploaderCompo />
      </div>
    </div>
  );
}
