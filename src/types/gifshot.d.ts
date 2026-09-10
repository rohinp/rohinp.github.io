declare module "gifshot" {
  type GifshotOptions = {
    images: string[];
    gifWidth?: number;
    gifHeight?: number;
    interval?: number;
    numFrames?: number;
    progressCallback?: (progress: number) => void;
  };

  type GifshotResult = {
    error: boolean;
    errorMsg?: string;
    image?: string;
  };

  export function createGIF(options: GifshotOptions, callback: (result: GifshotResult) => void): void;
}
