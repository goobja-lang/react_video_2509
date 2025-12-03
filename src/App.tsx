import { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./component/Header";
import Home from "./page/Home";
import Footer from "./component/Footer";
import Video from "./page/Video";

function App() {
  return (
    <>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/video" element={<Video />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </>
  );
}

export default App;
