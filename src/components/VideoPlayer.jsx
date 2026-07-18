import { useEffect, useRef } from "react";
import Hls from "hls.js";

export default function VideoPlayer({ src, poster }) {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !src) return;

    // hls.js first (Chrome/Firefox/Edge); native HLS only as fallback (Safari/iOS).
    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(src);
      hls.attachMedia(video);
      return () => hls.destroy();
    }

    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = src;
    }
  }, [src]);

  return (
    <video ref={videoRef} className="video-player" controls poster={poster} />
  );
}
