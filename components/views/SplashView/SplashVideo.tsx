interface SplashVideoProps {
  show: boolean;
  fadeOut: boolean;
  videoRef: React.RefObject<HTMLVideoElement | null>;
}

export default function SplashVideo({ show, fadeOut, videoRef }: SplashVideoProps) {
  if (!show) return null;

  return (
    <div
      className={`absolute inset-0 z-10 transition-opacity duration-500 ${
        fadeOut ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        autoPlay
        muted
        loop
        playsInline
      >
        <source src="./simasdata-2.mov" type="video/quicktime" />
        <source src="./simasdata-2.mov" type="video/mp4" />
      </video>
    </div>
  );
}