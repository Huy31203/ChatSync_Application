import { ImageLoader } from 'next/image';

import { BE_URL } from '@/constants/endpoint';

// Create a configurable loader that can accept a token
export const createImageLoader = (token: string): ImageLoader => {
  return ({ src, width, quality }) => {
    if (src.includes(BE_URL)) {
      return `${src}&token=${token}&w=${width}&q=${quality || 75}`;
    }
    return `/_next/image?url=${encodeURIComponent(src)}&w=${width}&q=${quality || 75}`;
  };
};

// Default loader with empty token
const defaultImageLoader = ({ src, width, quality }: { src: string; width: number; quality?: number }) => {
  if (src.includes(BE_URL)) {
    return `${src}&w=${width}&q=${quality || 75}`;
  }
  return `/_next/image?url=${encodeURIComponent(src)}&w=${width}&q=${quality || 75}`;
};

export default defaultImageLoader;
