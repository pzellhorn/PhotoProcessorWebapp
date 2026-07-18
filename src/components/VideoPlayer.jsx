import { useEffect, useRef } from "react";
import Hls from "hls.js";

export default function VideoPlayer({ src, poster, startAt }) {
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

  useEffect(() => {
    const video = videoRef.current;
    if (!video || startAt == null) return;

    function seek() {
      video.currentTime = startAt;
    }

    if (video.readyState >= 1) {
      seek();
      return;
    }

    video.addEventListener("loadedmetadata", seek);
    return () => video.removeEventListener("loadedmetadata", seek);
  }, [src, startAt]);

  return (
    <video ref={videoRef} className="video-player" controls poster={poster} />
  );
}
