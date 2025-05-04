
import { useRef, useEffect } from "react";

interface YoutubeBackgroundProps {
  videoId: string;
  opacity?: number;
}

const YoutubeBackground = ({ videoId, opacity = 0.65 }: YoutubeBackgroundProps) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const overlayOpacity = 1 - opacity;

  useEffect(() => {
    // Add YouTube API script if not already added
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
    }
    
    let player: any;
    
    // Initialize YouTube player when API is ready
    const onYouTubeIframeAPIReady = () => {
      player = new window.YT.Player(iframeRef.current, {
        videoId: videoId,
        playerVars: {
          autoplay: 1,
          loop: 1,
          playlist: videoId, // Required for looping
          controls: 0,
          showinfo: 0,
          rel: 0,
          mute: 1,
          playsinline: 1,
        },
        events: {
          onReady: (event: any) => {
            event.target.playVideo();
            event.target.mute();
          },
          onStateChange: (event: any) => {
            if (event.data === window.YT.PlayerState.ENDED) {
              player.playVideo();
            }
          }
        }
      });
    };
    
    // Set up the YouTube API callback
    if (window.YT && window.YT.Player) {
      onYouTubeIframeAPIReady();
    } else {
      window.onYouTubeIframeAPIReady = onYouTubeIframeAPIReady;
    }
    
    return () => {
      if (player && player.destroy) {
        player.destroy();
      }
    };
  }, [videoId]);

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden z-[-1]">
      <div className="absolute inset-0 w-full h-full">
        <div className="relative w-full h-full pb-[56.25%]">
          <div 
            ref={iframeRef as any} 
            id="youtube-player"
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
      </div>
      <div 
        className="absolute inset-0 bg-black z-10" 
        style={{ opacity: overlayOpacity }}
      />
    </div>
  );
};

export default YoutubeBackground;
