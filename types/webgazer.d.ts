// webgazer.d.ts
interface WebGazerParams {
  cameraWidth: number;
  cameraHeight: number;
  // Include other params as needed
}
interface WebGazerExtension {
  registerGazeTracker(callback: (data: any, elapsedTime: any) => void): any;
  removeGazeTracker(tracker: any): void;
}

interface WebGazerExtended extends WebGazer {
  registerGazeTracker(callback: (data: any, elapsedTime: any) => void): any;
  removeGazeTracker(tracker: any): void;
}

interface WebGazer {
  setGazeListener(callback: (data: WebGazerGazeData | null, elapsedTime: number) => void): WebGazer;
  // clearGazeListener(): void;
  setRegression(method: string): WebGazer;
  setTracker(tracker: string): WebGazer;
  begin(): Promise<void>;
  showPredictionPoints(show: boolean): WebGazer;
  params: WebGazerParams;
  
  // Include other methods as needed
  // Declare the calibratePoint method with the expected parameters
  calibratePoint(x: number, y: number): void;
}


// Extend the Window interface
interface Window {
  webgazer: WebGazer;
}
// declare module '@jspsych/plugin-html-button-response';
  
declare module 'webgazer' {
  interface WebGazer {
    showVideoPreview(show: boolean): WebGazer;
    // Add other methods or properties you're using that TypeScript isn't recognizing
  }
}
declare module 'jspsych' {
  export function init(config: any): void;
  export function run(timeline: any[]): void;
}

// declare module 'webgazer';
// declare module '@jspsych/plugin-webgazer-init-camera';
// declare module '@jspsych/plugin-webgazer-calibrate';
// declare module '@jspsych/plugin-webgazer-validate';
// declare module '@jspsych/extension-webgazer';
// declare module '@jspsych/core';