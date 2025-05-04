
import { useRef, useEffect } from "react";

interface YoutubeBackgroundProps {
  videoId: string;
  opacity?: number;
}

const YoutubeBackground = ({ videoId, opacity = 0.65 }: YoutubeBackgroundProps) => {
  const overlayOpacity = 1 - opacity;

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden z-[-1]">
      <div className="yt-wrapper">
        <div className="yt-frame-container">
          <iframe 
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&color=white&controls=0&modestbranding=1&playsinline=1&rel=0&enablejsapi=1&playlist=${videoId}`}
            title="YouTube video player" 
            frameBorder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
            referrerPolicy="strict-origin-when-cross-origin" 
            allowFullScreen
          />
        </div>
      </div>
      
      <div 
        className="absolute inset-0 bg-black z-10" 
        style={{ opacity: overlayOpacity }}
      />
      
      <style>
        {`
          @media screen and (min-width: 768px) {
            .yt-wrapper {
              overflow: hidden;
              max-width: 100%;
            }

            .yt-frame-container {
              position: relative;
              padding-bottom: 56.25%; 
              padding-top: 25px;
              width: 300%;
              left: -100%;
            }

            .yt-frame-container iframe {
              position: absolute; 
              top: 0; 
              left: 0; 
              width: 100%; 
              height: 100%;
              pointer-events: none;
            }
          }

          @media screen and (max-width: 767px) {
            .yt-frame-container iframe {
              aspect-ratio: 16/9;
              pointer-events: none;
              width: 100%;
            }
          }
        `}
      </style>
    </div>
  );
};

export default YoutubeBackground;
