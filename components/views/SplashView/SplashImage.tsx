import Image from 'next/image';

interface SplashImageProps {
  show: boolean;
  fadeOut: boolean;
}

export default function SplashImage({ show, fadeOut }: SplashImageProps) {
  if (!show) return null;

  return (
    <div
      className={`absolute inset-0 z-20 transition-opacity duration-500 ${
        fadeOut ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <Image
        src="./simasdata-1.jpg"
        alt="Gallery Landing"
        fill
        className="object-cover"
        priority
      />
    </div>
  );
}