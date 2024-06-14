"use client";
import { useRouter } from 'next/router'
import Layout from "@/layouts/Layout";
import CallEndIcon from '@material-ui/icons/CallEnd';
import React, { useEffect, useState, useRef } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import ReactMarkdown from 'react-markdown';
import { Card, CardContent, Typography } from '@mui/material';
import useFirestore from '@/hooks/useFirestore';
import * as sdk from "microsoft-cognitiveservices-speech-sdk";
import { AudioConfig, ResultReason, SpeechConfig, SpeechRecognizer } from "microsoft-cognitiveservices-speech-sdk";
import { CohereClient } from "cohere-ai";
import Webcam from 'react-webcam';
import 'firebase/storage';
import * as firebase from 'firebase/app';
import { getStorage, ref, uploadBytesResumable } from "firebase/storage";
import LinearProgress from '@mui/material/LinearProgress';
import Dialog from '@mui/material/Dialog';

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

firebase.initializeApp(firebaseConfig);


declare const GazeRecorderAPI: any;
declare const GazePlayer: any;

const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY; // API key for Google Generative AI. Put it in .env
const MICROSOFT_SPEECH_API_KEY = process.env.NEXT_PUBLIC_MICROSOFT_SPEECH_API_KEY || ''; // API key for Microsoft Speech API. Put it in .env

if (!API_KEY || !MICROSOFT_SPEECH_API_KEY) {
    throw new Error("API_KEY and MICROSOFT_SPEECH_API_KEY must be defined in the environment variables");
}


const speakText = async (text: string, recognizer: sdk.SpeechRecognizer, signal: AbortSignal) => {
    if (signal.aborted) {
        console.log('Speech synthesis aborted.');
        return;
    }

    console.log("speakText function called with text:", text);
    const speechConfig = sdk.SpeechConfig.fromSubscription(MICROSOFT_SPEECH_API_KEY, "centralindia");
    const audioConfig = sdk.AudioConfig.fromDefaultSpeakerOutput();
    speechConfig.speechSynthesisVoiceName = "en-US-JennyNeural";
    const synthesizer = new sdk.SpeechSynthesizer(speechConfig, audioConfig);

    if (signal.aborted) {
        console.log('Speech synthesis aborted before stopping recognizer.');
        synthesizer.close();
        return;
    }

    await recognizer.stopContinuousRecognitionAsync();

    return new Promise((resolve, reject) => {
        if (signal.aborted) {
            console.log('Speech synthesis aborted before starting to speak text.');
            synthesizer.close();
            return;
        }

        synthesizer.speakTextAsync(text,
            async function (result) {
                if (signal.aborted) {
                    console.log('Speech synthesis aborted during synthesis.');
                    synthesizer.close();
                    return;
                }

                if (result.reason === sdk.ResultReason.SynthesizingAudioCompleted) {
                    synthesizer.close();

                    const speechDurationMs = result.audioDuration / 10000;

                    if (signal.aborted) {
                        console.log('Speech synthesis aborted before starting recognizer.');
                        return;
                    }

                    await new Promise(resolve => setTimeout(resolve, speechDurationMs));
                    recognizer.startContinuousRecognitionAsync();

                    resolve(null);
                } else {
                    console.error("Speech synthesis canceled, " + result.errorDetails);
                    reject(result.errorDetails);
                }
            },
            function (err) {
                console.trace("speakTextAsync error callback called with error:", err);
                synthesizer.close();
                reject(err);
            }
        );
    }).catch((err) => {
        if (signal.aborted) {
            console.log('Speech synthesis aborted after error.');
            return;
        }

        recognizer.startContinuousRecognitionAsync();
        throw err;
    });
}




const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });
// const cohere = new CohereClient({ token: "", });

const generationConfig = {
    temperature: 0.4,
    topK: 15,
    topP: 0.8,
    maxOutputTokens: 300,
};

let mediaRecorderRef: MediaRecorder | null = null;


export default function InterviewScreen() {



    // console.log('InterviewScreen rendered');

    const [abortController, setAbortController] = useState(new AbortController());
    let isSpeaking = false;


    const hasFetchedAnswers = useRef(false);
    const storage = getStorage();
    const [dialogOpen, setDialogOpen] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const router = useRouter();
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const [history, setHistory] = useState<string[]>([]);
    const [currentAnswer, setCurrentAnswer] = useState<string>('');
    const [answers, setAnswers] = useState<string[]>([]);
    const hasRun = useRef(false);
    const { uuid } = router.query;
    const { getInterviewDetails, addInterviewHistory } = useFirestore();
    const { addFeedbackAnalysis } = useFirestore();
    const [interviewDetails, setInterviewDetails] = useState(null);
    const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
    const [recognizedTexts, setRecognizedTexts] = useState<string[]>([]);
    const questions = [
        "Yes, please start the interview",
    ];
    // const [currentCalibrationPoint, setCurrentCalibrationPoint] = useState<number>(0);

    let webcamRef = useRef<Webcam>(null);
    const [capturing, setCapturing] = useState(false);

    const handleStartCaptureClick = () => {
        // console.log('handleStartCaptureClick started');
        setCapturing(true);
        if (webcamRef.current && webcamRef.current.stream) {
            startCapture();
        } else {
            // console.log('Webcam stream is not available, waiting for 1000ms before trying again');
            setTimeout(handleStartCaptureClick, 1000);
        }
    };

    const startCapture = () => {
        if (webcamRef.current) {
            const stream = webcamRef.current.stream;
            if (stream && mediaRecorderRef === null) {
                mediaRecorderRef = new MediaRecorder(stream, {
                    mimeType: 'video/webm'
                });
                // console.log('New MediaRecorder instance created');
            } else {
                // console.log('Existing MediaRecorder instance:', mediaRecorderRef);
                if (mediaRecorderRef) {
                    // console.log('MediaRecorder state:', mediaRecorderRef.state);
                }
            }
            if (mediaRecorderRef) {
                mediaRecorderRef.addEventListener('dataavailable', handleDataAvailable);
                mediaRecorderRef.start();
                // console.log('Video capture started');
            } else {
                // console.log('Failed to initialize MediaRecorder');
            }
        } else {
            // console.log('Webcam stream is not available');
        }
    };


    // Create the speech config
    const speechConfig = sdk.SpeechConfig.fromSubscription(MICROSOFT_SPEECH_API_KEY, "centralindia");

    // Create an audio config for the microphone
    const audioConfig = sdk.AudioConfig.fromDefaultMicrophoneInput();


    // Create the speech recognizer
    const recognizer = new sdk.SpeechRecognizer(speechConfig, audioConfig);



    // Google Gemini AI
    const fetchAnswers = async (chat: any, signal: any) => {
        if (signal.aborted) {
            console.log('Fetching answers aborted.');
            return;
        }
        else{
            console.log('Fetching answers not aborted.');
        }
        console.log("Fetching answers...");

        let newAnswers: string[] = [];

        for (let i = 0; i < questions.length; i++) {
            if (signal.aborted) {
                console.log('Fetching answers aborted.');
                return;
            }
            try {
                // console.log(`Fetching answer for question ${i + 1}`);
                setHistory(prevHistory => [...prevHistory, `Candidate: ${questions[i]}`]);
                const response = await chat.sendMessageStream(questions[i]);

                if (signal.aborted) {
                    console.log('Fetching answers aborted.');
                    return;
                }

                
                let answer = '';
                for await (const chunk of response.stream) {
                    if (signal.aborted) {
                        console.log('Fetching answers aborted.');
                        return;
                    }
                    const chunkText = await chunk.text();
                    answer += chunkText;
                }

                newAnswers.push(answer);
                // console.log(`Answer for question ${i + 1} fetched successfully`);
                setHistory(prevHistory => [...prevHistory, `Interviewer: ${answer}`]);
                setAnswers(prevAnswers => [...prevAnswers, answer]);

                await speakText(answer, recognizer, signal);
            } catch (error) {
                console.error("Error fetching answer:", error);
            }
        }
    }


    // Uncomment the following useEffect to fetch answers from the model
    // console.log('Current path:', router.asPath);
    useEffect(() => {

        // if (!hasRun.current) {
        let chat: any;

        // console.log('useEffect is running');

        // console.log('Answers state:', answers);

        if (router.isReady && router.asPath != '/[id]' && !hasFetchedAnswers.current) {

            // Gemini 
            const fetchData = async () => {
                // console.log('Fetching data...');
                const uuidFromPath = router.asPath.replace('/', '') as string;
                const data = await getInterviewDetails(uuidFromPath);
                // console.log('Data fetched:');
                // console.log('Data:', data);
                setInterviewDetails(data);


                const chat = model.startChat({
                    generationConfig,
                    history: [
                        {
                            role: "user",
                            parts: [{ text: "System prompt: You are an AI assistant designed to conduct thorough and unbiased technical interviews. Your goal is to assess the candidate's technical knowledge, problem-solving abilities, and communication skills objectively and professionally. The job description for this interview is: " + data.description + "You will ask the candidate a series of predefined questions related to the job role: " + data.questions + "After each response, you should critically analyze the answer and ask relevant follow-up questions to probe deeper into the candidate's understanding and experience. Additionally, you will explore the candidate's knowledge and capabilities on these key areas and technical keywords: " + data.keywords + "Throughout the interview, you should maintain a friendly yet professional demeanor. If the candidate's response is incomplete, inaccurate, or lacks sufficient detail, provide constructive feedback and politely ask them to clarify or expand their answer. However, avoid being overly critical or dismissive." + "The candidate's name is " + data.nameofCandidate + ". This is the content of the candidate's resume: " + data.pdfText + "You should incorporate relevant details from their resume into your line of questioning and assessment. Please note that you should not acknowledge or confirm whether you are an AI model or not. Your role is to simulate a real-life interview experience as closely as possible, conducted by a knowledgeable and experienced human interviewer.You should keep your questions concise, focused, and tailored to the specific job role and the candidate's background. Avoid asking irrelevant or overly broad questions that could lead the conversation astray. Throughout the interview, you should maintain objectivity and avoid any form of bias or discrimination based on the candidate's personal characteristics or background. Your responses should be thorough, insightful, and showcase your deep understanding of the technical domain and interviewing best practices. Only ask one question at one time, and do not give the answer. Your role is to just ask questions. Respond understood if you got it." }],
                        },
                        {
                            role: "model",
                            parts: [{ text: "Understood." }],

                        },
                        {
                            role: "user",
                            parts: "I am ready to start the interview."

                        },
                        {
                            role: "model",
                            parts: "Great! I am going to start with the first question"
                        }
                    ],
                });

                // console.log("Chat"); // Debugging statement

                // console.log("Fetching answers...");
                // fetchAnswers(chat, data.questions);

                // console.log("Fetching answers...");
                console.log('Status of abortController inside fetchData:', abortController.signal.aborted);
                await fetchAnswers(chat, abortController.signal);
                hasFetchedAnswers.current = true;



                navigator.mediaDevices.getUserMedia({ audio: true })
                    .then(stream => {
                        if (abortController.signal.aborted) {
                            console.log('Speech-to-text aborted.');
                            return;
                        }

                        // Create an audio config from the stream
                        const audioConfig = AudioConfig.fromStreamInput(stream);


                        // Create the speech recognizer
                        const recognizer = new SpeechRecognizer(speechConfig, audioConfig);

                        // Subscribe to the recognized event
                        recognizer.recognized = async (s, e) => {
                            if (abortController.signal.aborted) {
                                console.log('Speech-to-text aborted.');
                                return;
                            }

                            if (e.result.reason === ResultReason.RecognizedSpeech) {
                                // console.log(`Text Recognized:`);
                                // console.log(`Text Recognized: ${e.result.text}`);

                                setRecognizedTexts(prevTexts => [...prevTexts, e.result.text]);
                                setHistory(prevHistory => [...prevHistory, `Candidate: ${e.result.text}`]);
                                // Send the recognized text to Google AI
                                const response = await chat.sendMessageStream(e.result.text);
                                let answer = '';
                                for await (const chunk of response.stream) {
                                    const chunkText = await chunk.text();
                                    answer += chunkText;
                                    // console.log('Chunk text:', chunkText);
                                }
                                // console.log('Answer:', answer);
                                setAnswers(prevAnswers => [...prevAnswers, answer]);
                                setHistory(prevHistory => [...prevHistory, `Interviewer: ${answer}`]);
                                console.log('Status of abortController inside recognized event:', abortController.signal.aborted);
                                await speakText(answer, recognizer, abortController.signal);
                            } else if (e.result.reason === ResultReason.NoMatch) {
                                // console.log("No speech could be recognized.");
                            }
                        };

                        // Subscribe to the session stopped event
                        recognizer.sessionStopped = (s, e) => {
                            if (abortController.signal.aborted) {
                                console.log('Speech-to-text aborted.');
                                return;
                            }
                            
                            // console.log("\n    Session stopped event.");
                            recognizer.stopContinuousRecognitionAsync();
                        };

                        // Start continuous recognition
                        recognizer.startContinuousRecognitionAsync();
                    })
                    .catch(error => {
                        console.error(`Error getting user media: ${error}`);
                    });

            };


            fetchData();
            handleStartCaptureClick();

        }

        hasRun.current = true;
        // }
    }, [router.isReady]);



    const endCall = async () => {

        console.log('Aborting operations...');
        abortController.abort();
        console.log('Operations aborted.');
        console.log('AbortController status:', abortController.signal.aborted);
        setAbortController(new AbortController()); // Reset the AbortController

        try {
            const videoChunks = await handleStopCaptureClick();
            // console.log('Video capture stopped successfully.');
            await handleUploadVideo(videoChunks); // Pass chunks directly

        } catch (error) {
            console.error('Error in stopping video capture or uploading:', error);
        }




        const uuidFromPath = router.asPath as string;
        const uuid = uuidFromPath.substring(1);
        // console.log('UUID:', uuid);
        if (!uuid) {
            // console.log("UUID is not defined");
            return;
        }

        // console.log("Call ended. Final history:");
        // console.log(history);






        // Add the history to Firestore
        const success = await addInterviewHistory(uuid as string, history);
        if (success) {
            // console.log("Interview history added successfully");
        } else {
            // console.log("Error adding interview history");
        }

        // Send the history to Google's AI
        const chatA = model.startChat({
            history: [
                {
                    role: "user",
                    parts: "Hi."
                },
                {
                    role: "model",
                    parts: "How can I help you?"
                }
            ],
        });

        // Read the response
        const response = await chatA.sendMessageStream(`Analyze the provided interview script and generate a JSON-formatted evaluation of the candidate's performance. The evaluation should include scores out of 100 for overall suitability, communication skills (clarity, articulation, listening skills), confidence (body language, eye contact, posture), and the presence of relevant keywords (industry terms, key phrases, technical jargon).

        For overall suitability, consider the candidate's ability to demonstrate relevant knowledge, experience, and qualifications for the role. Evaluate their responses to ensure they align with the job requirements and company culture.
        
        For communication skills, assess the following:
        
            Clarity: How well the candidate expresses their thoughts and ideas in a clear and concise manner.
            Articulation: The candidate's ability to speak fluently and coherently, without excessive filler words or verbal tics.
            Listening Skills: Whether the candidate actively listens to the interviewer's questions and provides relevant responses.
                
        For relevant keywords, assess the following:
        
            Industry Terms: The candidate's use of industry-specific terminology and concepts relevant to the role.
            Key Phrases: The inclusion of key phrases or buzzwords that demonstrate an understanding of the company's goals, values, and expectations.
            Technical Jargon: The candidate's ability to use and explain technical jargon or concepts specific to the role or industry.
        
        Additionally, provide AI insights that highlight the candidate's strengths and areas for improvement, based on the evaluation criteria. Use the following structure as a template for the expected JSON output:

      {
        "evaluation": {
          "overallSuitability": "[Overall Suitability Score]",
          "communicationSkills": {
            "clarity": "[Clarity Score]",
            "articulation": "[Articulation Score]",
            "listeningSkills": "[Listening Skills Score]"
          },
          
          "relevantKeywords": {
            "industryTerms": "[Industry Terms Score]",
            "keyPhrases": "[Key Phrases Score]",
            "technicalJargon": "[Technical Jargon Score]"
          }
        },
        "aiInsights": {
          "strengths": [
            "[List strengths here]"
          ],
          "areasForImprovement": [
            "[List areas for improvement here]"
          ]
        }
      }

     ${history}`);

        let feedbackAnalysis = '';
        for await (const chunk of response.stream) {
            const chunkText = await chunk.text();
            feedbackAnalysis += chunkText;
        }

        // Log the feedbackAnalysis
        feedbackAnalysis = feedbackAnalysis.replace(/```/g, '');
        // console.log("Feedback analysis:");
        // console.log("feedbackAnalysis" + feedbackAnalysis);

        // Check if feedbackAnalysis is a valid JSON string
        try {
            let cleanedFeedbackAnalysis = feedbackAnalysis.replace(/^JSON\n/, '').trim();
            let responseJSON = JSON.parse(cleanedFeedbackAnalysis);
            // console.log("Response JSON:");
            // console.log("Response JSON:", responseJSON);
        } catch (error) {
            console.error("Invalid JSON string:", feedbackAnalysis);
        }


        const successForFeedback = await addFeedbackAnalysis(uuid as string, feedbackAnalysis);
        if (successForFeedback) {
            // console.log("Feedback analysis added successfully");
        } else {
            // console.log("Error adding feedback analysis");
        }




    };

    const handleDataAvailable = (e: BlobEvent) => {
        if (e.data.size > 0) {
            setRecordedChunks((prev) => prev.concat([e.data]));
            // console.log('Data available from video capture'); // Add this line
        }
    };

    const handleStopCaptureClick = (): Promise<Blob[]> => {
        // console.log('handleStopCaptureClick started');
        return new Promise((resolve, reject) => {
            if (mediaRecorderRef && mediaRecorderRef.state === 'recording') {
                // console.log(`MediaRecorder is active. Current state: ${mediaRecorderRef.state}`);
                let chunks: Blob[] = [];

                mediaRecorderRef.addEventListener('dataavailable', (e: BlobEvent) => {
                    if (e.data.size > 0) {
                        chunks.push(e.data);
                        // console.log('Data available from video capture');
                    }
                });

                mediaRecorderRef.onstop = () => {
                    // console.log('MediaRecorder stopped');
                    if (chunks.length > 0) {
                        setRecordedChunks(chunks); // Update state once with all chunks
                        resolve(chunks); // Resolve with chunks for immediate use
                        // console.log('Promise resolved with data');
                    } else {
                        reject('No data available');
                    }
                };

                // console.log('Stopping MediaRecorder');
                mediaRecorderRef.stop();
            } else {
                // console.log('MediaRecorder does not exist or is not active');
                resolve([]);
            }
        });
    };


    const handleUploadVideo = async (chunks: Blob[]) => {
        // console.log('handleUploadVideo...'); // Add this line

        setDialogOpen(true);

        const uuidFromPath = router.asPath as string;
        const uuid = uuidFromPath.substring(1);
        // console.log('UUID:', uuid);
        if (!uuid) {
            console.error("UUID is not defined");
            return;
        }
        else {
            // console.log("UUID is defined in handleUploadVideo function.");
            // console.log("UUID: ", uuid);
        }
        const blob = new Blob(chunks, { type: 'video/webm' });

        // console.log(`Video size: ${blob.size} bytes`);
        if (blob.size === 0) {
            console.error("No video data to upload.");
            return;
        }
        const storage = getStorage();
        const storageRef = ref(storage, `videos/${uuid}.webm`);
        const uploadTask = uploadBytesResumable(storageRef, blob);

        // console.log('Starting video upload'); // Add this line

        uploadTask.on('state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                // console.log(`Upload is ${progress}% done`);
                setUploadProgress(progress);
            },
            (error) => {
                console.error('Upload failed:', error);
                setDialogOpen(false); // Close the dialog on error
            },
            () => {
                // console.log('Video uploaded successfully!');
                setUploadProgress(0); // Reset progress after upload
                setDialogOpen(false); // Close the dialog after upload
            }
        );
    };

    return (
        <Layout>

            <div style={{ display: 'flex', height: '100vh', width: '100%' }}>
                <div style={{ flex: 1, position: 'relative' }}>
                    <Webcam

                        height={720}
                        ref={webcamRef}
                        screenshotFormat="image/jpeg"
                        width={1280}
                        videoConstraints={{
                            facingMode: 'user'
                        }}
                    />

                    <button onClick={endCall} style={{
                        position: 'absolute',
                        bottom: '10px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '10px 20px',
                        color: 'red'
                    }}>
                        <CallEndIcon style={{ marginRight: '20px', fontSize: '30px', color: 'red' }} />
                        End Call
                    </button>
                </div>
                <div style={{
                    width: 'calc(40% - 6rem)',
                    backgroundColor: 'white',
                    padding: '2rem',
                    boxSizing: 'border-box'
                }}>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' }}>Questions</div>
                    <div style={{ fontSize: '1.2rem', lineHeight: '1.5', maxHeight: '90%', overflowY: 'auto' }}>
                        {answers.map((answer, index) => {
                            return (
                                <Card key={index} sx={{ marginBottom: '1rem' }}>
                                    <CardContent>
                                        <Typography color="textSecondary" gutterBottom style={{ color: 'black', fontWeight: 'bold' }} component="div">
                                            <ReactMarkdown>{answer}</ReactMarkdown>
                                        </Typography>
                                        <Typography variant="body2" component="div">
                                            Candidate: {recognizedTexts[index]}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                </div>
            </div>
            <Dialog open={dialogOpen}>
                <div style={{ padding: '20px', textAlign: 'center' }}>
                    <Typography variant="h6">Processing...</Typography>
                    <LinearProgress variant="determinate" value={uploadProgress} style={{ marginTop: '20px' }} />
                </div>
            </Dialog>
        </Layout>
    );

}  