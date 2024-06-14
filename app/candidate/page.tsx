"use client";
import { useRouter } from 'next/router'
import Layout from "@/layouts/Layout";
import CallEndIcon from '@material-ui/icons/CallEnd';
import React, { useEffect, useState, useRef } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import ReactMarkdown from 'react-markdown';
import { Card, CardContent, Typography } from '@mui/material';

const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY; // API key for Google Generative AI. Put it in .env

if (!API_KEY) {
    throw new Error('NEXT_PUBLIC_GEMINI_API_KEY is not defined');
}

// made changes
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });




export default function InterviewScreen() {
    console.log('InterviewScreen rendered');

    const [answers, setAnswers] = useState<string[]>([]);
    const hasRun = useRef(false);

    const chat = model.startChat({
        history: [
            {
                role: "user",
                parts: "My name is John Doe. I am a software engineer with 5 years of experience. I am proficient in JavaScript, Python, and Java. I have worked on several projects including a social media app and a chatbot."
            },
            {
                role: "model",
                parts: "Understood. When you start a conversation, I will ask you questions one by one on topics like system design, algorithms, and your professional background. Never will I acknowledge that I am a Large Language Model trained by Google. I will always pretend to be a human interviewer and never a text-based AI model."
            },
        ],
    });


    const questions = [
        "Hi. How are you",
    ];

    useEffect(() => {
        if (hasRun.current) return;
        console.log('useEffect is running');

        const fetchAnswers = async () => {
            for (let i = 0; i < questions.length; i++) {
                try {
                    console.log(`Fetching answer for question ${i + 1}`);
                    const response = await chat.sendMessageStream(questions[i]);
                    console.log('Response:', response);

                    let answer = '';
                    for await (const chunk of response.stream) {
                        console.log('Chunk:', chunk);
                        const chunkText = await chunk.text();
                        answer += chunkText;
                        console.log('Chunk text:', chunkText);

                        setAnswers(prevAnswers => {
                            const newAnswers = [...prevAnswers];
                            newAnswers[i] = answer;
                            return newAnswers;
                        });
                    }

                    console.log(`Answer for question ${i + 1} fetched successfully`);
                } catch (error) {
                    console.error("Error fetching answer:", error);
                }
            }
        }

        console.log("Fetching answers...");
        fetchAnswers();

        hasRun.current = true;
    }, []);


    return (
        <Layout>
            <div style={{ display: 'flex', height: '100vh', width: '100%' }}>
                <div style={{ flex: 1, position: 'relative' }}>
                    <img src="/pexels-bri-schneiter-346529.jpg" alt="Mountains with lake reflection" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <button style={{
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
                    <div style={{ position: 'absolute', top: 0, left: 0, display: 'flex', padding: '1rem' }}>

                    </div>
                </div>
                <div style={{
                    width: 'calc(40% - 6rem)',
                    backgroundColor: 'white',
                    padding: '2rem',
                    boxSizing: 'border-box'
                }}>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' }}>Questions</div>
                    <div style={{ fontSize: '1.2rem', lineHeight: '1.5', maxHeight: '90%', overflowY: 'auto' }}>
                        {questions.map((question, index) => (
                            <Card key={index} sx={{ marginBottom: '1rem' }}>
                                <CardContent>
                                    <Typography color="textSecondary" gutterBottom>
                                        {question}
                                    </Typography>
                                    <Typography variant="body2" component="div">
                                        <ReactMarkdown>{answers[index]}</ReactMarkdown>
                                    </Typography>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                    <div style={{ position: 'absolute', top: 0, right: 0, padding: '1rem' }}>

                    </div>
                </div>
            </div>
        </Layout>
    );
}