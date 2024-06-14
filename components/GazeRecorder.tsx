import React, { useEffect, useRef } from 'react';

declare global {
    interface Window {
        GazeRecorderAPI: any;
        GazePlayer: any;
        GazeCloudAPI: any;
    }
}

const GazeRecorder: React.FC = () => {
    const playerDivRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const scriptsToLoad = [
            'https://app.gazerecorder.com/GazeCloudAPI.js',
            'https://app.gazerecorder.com/GazeRecorderAPI.js',
            'https://app.gazerecorder.com/GazePlayer.js',
        ];

        const loadedScripts: string[] = [];

        const handleScriptLoad = () => {
            if (loadedScripts.length === scriptsToLoad.length) {
                window.GazeRecorderAPI.OnNavigation = function (url: string) {
                    console.log('Navigation:', url);
                };

                const endRec = () => {
                    window.GazeRecorderAPI.StopRec();
                    window.GazeCloudAPI.StopEyeTracking();
                };

                const playRec = () => {
                    endRec();
                    window.GazePlayer.SetCountainer(playerDivRef.current);
                    const sessionReplayData = window.GazeRecorderAPI.GetRecData();
                    window.GazePlayer.PlayResultsData(sessionReplayData);
                };

                const start = (url: string) => {
                    window.GazeCloudAPI.StartEyeTracking();
                    window.GazeCloudAPI.OnCalibrationComplete = function () {
                        window.GazeRecorderAPI.Rec(url);
                    };
                };

                const navigate = (url: string) => {
                    window.GazeRecorderAPI.Navigate(url);
                };

                // Expose functions to the parent component
                (window as any).endRec = endRec;
                (window as any).playRec = playRec;
                (window as any).start = start;
                (window as any).navigate = navigate;
            }
        };

        const loadScript = (src: string) => {
            const script = document.createElement('script');
            script.src = src;
            script.async = true;
            script.onload = () => {
                loadedScripts.push(src);
                handleScriptLoad();
            };
            document.body.appendChild(script);
        };

        scriptsToLoad.forEach(loadScript);

        return () => {
            const scripts = document.querySelectorAll('script');
            scripts.forEach((script) => {
                document.body.removeChild(script);
            });
        };
    }, []);

    return <div ref={playerDivRef} style={{ backgroundColor: 'white', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} />;
};

export default GazeRecorder;