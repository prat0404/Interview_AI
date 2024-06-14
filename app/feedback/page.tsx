"use client";
import { Progress } from 'antd';
import { CardTitle, CardDescription, CardHeader, CardContent, Card } from "@/components/ui/card"
import Layout from "@/layouts/Layout";
import { useState } from 'react';
import useFirestore from '@/hooks/useFirestore';
import { useRouter, useSearchParams } from 'next/navigation'
import { GoogleGenerativeAI } from "@google/generative-ai";
import React, { useEffect, useRef } from 'react';

const FeedbackPage = (): React.ReactNode => {

  const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY; // API key for Google Generative AI. Put it in .env

  if (!API_KEY) {
    throw new Error("API_KEY must be defined in the environment variables");
  }

  const genAI = new GoogleGenerativeAI(API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });


  const [progress, setProgress] = useState(0);
  const router = useRouter();
  const { getInterviewDetails } = useFirestore();
  const [interviewData, setInterviewData] = useState(null);
  const hasRun = useRef(false);
  const [isLoading, setIsLoading] = useState(true); // Add this line
  const [noDocument, setNoDocument] = useState(false);


  type ResponseJSONType = {
    evaluation: {
      overallSuitability: number;
      communicationSkills: {
        clarity: number;
        articulation: number;
        listeningSkills: number;
      };
      confidence: {
        bodyLanguage: number;
        eyeContact: number;
        posture: number;
      };
      relevantKeywords: {
        industryTerms: number;
        keyPhrases: number;
        technicalJargon: number;
      };
    };
    aiInsights: {
      strengths: string;
      areasForImprovement: string;
    };
  };

  const [responseJSON, setResponseJSON] = useState<ResponseJSONType | null>(null);


  useEffect(() => {
    console.log("UseEffect running");
    const fetchData = async () => {

      console.log("Fetching data");
      const data = await getInterviewDetails("fd0fd593-3469-4ff1-979a-483ee86e1790");
      // console.log(data.history);

      if (data === null) {
        setNoDocument(true);
        setIsLoading(false);
        return;
      }

      // const chat = model.startChat({
      //   history: [

      //     {
      //       role: "user",
      //       parts: "I am ready to start the interview."

      //     },
      //     {
      //       role: "model",
      //       parts: "How are you doing"
      //     }
      //   ],
      // });

      // // Send a message with the prompt "Summarize"
      // const response = await chat.sendMessageStream(`Analyze the provided interview script and generate a JSON-formatted evaluation of the candidate's performance. The evaluation should include scores out of 100 for overall suitability, communication skills (clarity, articulation, listening skills), confidence (body language, eye contact, posture), and the presence of relevant keywords (industry terms, key phrases, technical jargon). Additionally, provide AI insights that highlight the candidate's strengths and areas for improvement. Use the following structure as a template for the expected JSON output:

      // {
      //   "evaluation": {
      //     "overallSuitability": "[Overall Suitability Score]",
      //     "communicationSkills": {
      //       "clarity": "[Clarity Score]",
      //       "articulation": "[Articulation Score]",
      //       "listeningSkills": "[Listening Skills Score]"
      //     },
      //     "confidence": {
      //       "bodyLanguage": "[Body Language Score]",
      //       "eyeContact": "[Eye Contact Score]",
      //       "posture": "[Posture Score]"
      //     },
      //     "relevantKeywords": {
      //       "industryTerms": "[Industry Terms Score]",
      //       "keyPhrases": "[Key Phrases Score]",
      //       "technicalJargon": "[Technical Jargon Score]"
      //     }
      //   },
      //   "aiInsights": {
      //     "strengths": [
      //       "[List strengths here]"
      //     ],
      //     "areasForImprovement": [
      //       "[List areas for improvement here]"
      //     ]
      //   }
      // }

      // Interview Script:
      // 1. Question: Yes, please start the interview [id].tsx:75:20
      // 2. Answer: **Question 1:** Can you walk me through a recent software project you were involved in, highlighting your contributions? [id].tsx:75:20
      // 3. Question: I dont know. [id].tsx:75:20
      // 4. Answer: **Question 2:** How do you approach debugging a complex issue in a codebase? [id].tsx:75:20
      // 5. Question: I dont know. [id].tsx:75:20
      // 6. Answer: **Question 3:** How do you stay updated on current technologies and trends in software development?`);


      // // Read the response
      // let feedbackAnalysis = '';
      // for await (const chunk of response.stream) {
      //   const chunkText = await chunk.text();
      //   feedbackAnalysis += chunkText;
      // }

      // // Log the feedbackAnalysis
      // feedbackAnalysis = feedbackAnalysis.replace(/```/g, '');
      // // console.log("feedbackAnalysis" + feedbackAnalysis);


      // Check if feedbackAnalysis is a valid JSON string
      try {
        // let cleanedFeedbackAnalysis = feedbackAnalysis.replace(/^json/, '').trim();
        // let responseJSON = JSON.parse(cleanedFeedbackAnalysis);
        // setResponseJSON(responseJSON);

        let responseJSON = JSON.parse(data.feedbackAnalysis);
        setResponseJSON(responseJSON);

        // response.evaluation
        console.log("overallSuitability: " + responseJSON.evaluation.overallSuitability);

        console.log("communicationSkills.clarity: " + responseJSON.evaluation.communicationSkills.clarity);
        console.log("communicationSkills.articulation: " + responseJSON.evaluation.communicationSkills.articulation);
        console.log("communicationSkills.listeningSkills: " + responseJSON.evaluation.communicationSkills.listeningSkills);

        console.log("confidence.bodyLanguage: " + responseJSON.evaluation.confidence.bodyLanguage);
        console.log("confidence.eyeContact: " + responseJSON.evaluation.confidence.eyeContact);
        console.log("confidence.posture: " + responseJSON.evaluation.confidence.posture);

        console.log("relevantKeywords.industryTerms: " + responseJSON.evaluation.relevantKeywords.industryTerms);
        console.log("relevantKeywords.keyPhrases: " + responseJSON.evaluation.relevantKeywords.keyPhrases);
        console.log("relevantKeywords.technicalJargon: " + responseJSON.evaluation.relevantKeywords.technicalJargon);

        console.log("aiInsights.strengths: " + responseJSON.aiInsights.strengths);
        console.log("aiInsights.areasForImprovement: " + responseJSON.aiInsights.areasForImprovement);
      } catch (error) {
        console.error("Invalid JSON string:", data.feedbackAnalysis)
      }


      setIsLoading(false);
    };

    if (!hasRun.current) {
      fetchData();
      hasRun.current = true;
    }
  }, []);

  return (
    isLoading ? (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column', // Added this to stack the spinner and the text vertically
        backgroundColor: 'rgba(0, 0, 0, 0.5)' // semi-transparent background
      }}>
        <div style={{
          border: '16px solid #f3f3f3', // Light grey
          borderRadius: '50%',
          borderTop: '16px solid #3498db', // Blue
          width: '120px',
          height: '120px',
          animation: 'spin 2s linear infinite'
        }}></div>
        <p style={{
          marginTop: '20px',
          color: '#fff',
          fontSize: '18px',
          fontWeight: '500',
          textTransform: 'uppercase'
        }}>
          Fetching data from server
        </p>
        <style jsx global>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    ) : noDocument ? (
      <div>No such document!</div>
    ) :


      (
        <Layout>

          <CardHeader className="flex flex-col gap-1">
            <CardTitle>Interview Feedback</CardTitle>
            <CardDescription>Breakdown of AI-generated scores for a specific candidate&apos;s interview.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-4">
                <img
                  alt="Alex Campbell"
                  className="rounded-full border"
                  height="64"
                  src="/placeholder.svg"
                  style={{
                    aspectRatio: "64/64",
                    objectFit: "cover",
                  }}
                  width="64"
                />
                <div className="grid gap-1.5">
                  <h2 className="font-semibold text-lg">Alex Campbell</h2>
                  <p className="text-sm leading-none text-gray-500 dark:text-gray-400">Marketing Manager</p>
                </div>
              </div>

            </div>
            <div className="grid gap-4">
              <Card>
                <CardHeader className="flex flex-col gap-1">
                  <CardTitle>Overall Suitability</CardTitle>
                  <CardDescription>The candidate&apos;s overall suitability for the position.</CardDescription>
                </CardHeader>
                <CardContent className="flex items-center justify-center">
                  <div className="grid gap-1 text-center">
                    <h1 className="text-5xl font-bold">{responseJSON?.evaluation?.overallSuitability}%</h1>
                    {responseJSON?.evaluation?.overallSuitability !== undefined && (
                      <>
                        {responseJSON.evaluation.overallSuitability > 80 &&
                          <p className="text-sm text-gray-500 dark:text-gray-400">Excellent fit for the role</p>}
                        {responseJSON.evaluation.overallSuitability <= 80 && responseJSON.evaluation.overallSuitability > 60 &&
                          <p className="text-sm text-gray-500 dark:text-gray-400">Good fit for the role</p>}
                        {responseJSON.evaluation.overallSuitability <= 60 &&
                          <p className="text-sm text-gray-500 dark:text-gray-400">Needs improvement</p>}
                      </>
                    )}

                  </div>
                </CardContent>
              </Card>


              <Card>
                <CardHeader className="flex flex-col gap-1">
                  <CardTitle>Communication Skills</CardTitle>
                  <CardDescription>The candidate&apos;s ability to communicate effectively.</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                  <div className="flex items-center gap-4">
                    <h3 className="w-24">Clarity</h3>
                    <Progress
                      className="w-full rounded-full custom-progress"
                      percent={responseJSON?.evaluation?.communicationSkills.clarity}
                      strokeColor="black"
                      trailColor="grey"
                    />

                  </div>
                  <div className="flex items-center gap-4">
                    <h3 className="w-24">Articulation</h3>
                    <Progress
                      className="w-full rounded-full custom-progress"
                      percent={responseJSON?.evaluation?.communicationSkills.articulation}
                      strokeColor="black"
                      trailColor="grey"
                    />

                  </div>
                  <div className="flex items-center gap-4">
                    <h3 className="w-24">Listening Skills</h3>
                    <Progress
                      className="w-full rounded-full custom-progress"
                      percent={responseJSON?.evaluation?.communicationSkills.listeningSkills}
                      strokeColor="black"
                      trailColor="grey"
                      format={percent => <span style={{ color: percent === 100 ? 'black' : 'initial' }}>{percent}%</span>}
                    />

                  </div>
                </CardContent>
              </Card>


              <Card>
                <CardHeader className="flex flex-col gap-1">
                  <CardTitle>Confidence</CardTitle>
                  <CardDescription>The candidate&apos;s level of confidence during the interview.</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                  <div className="flex items-center gap-4">
                    <h3 className="w-24">Body Language</h3>
                    <Progress
                      className="w-full rounded-full custom-progress"
                      percent={responseJSON?.evaluation?.confidence.bodyLanguage}
                      strokeColor="black"
                      trailColor="grey"
                    />

                  </div>
                  <div className="flex items-center gap-4">
                    <h3 className="w-24">Eye Contact</h3>
                    <Progress
                      className="w-full rounded-full custom-progress"
                      percent={responseJSON?.evaluation?.confidence.eyeContact}
                      strokeColor="black"
                      trailColor="grey"
                    />

                  </div>
                  <div className="flex items-center gap-4">
                    <h3 className="w-24">Posture</h3>
                    <Progress
                      className="w-full rounded-full custom-progress"
                      percent={responseJSON?.evaluation?.confidence.posture}
                      strokeColor="black"
                      trailColor="grey"
                    />

                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-col gap-1">
                  <CardTitle>Relevant Keywords</CardTitle>
                  <CardDescription>The use of relevant keywords by the candidate.</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                  <div className="flex items-center gap-4">
                    <h3 className="w-24">Industry Terms</h3>
                    <Progress
                      className="w-full rounded-full custom-progress"
                      percent={responseJSON?.evaluation?.relevantKeywords.industryTerms}
                      strokeColor="black"
                      trailColor="grey"
                    />

                  </div>
                  <div className="flex items-center gap-4">
                    <h3 className="w-24">Key Phrases</h3>
                    <Progress
                      className="w-full rounded-full custom-progress"
                      percent={responseJSON?.evaluation?.relevantKeywords.keyPhrases}
                      strokeColor="black"
                      trailColor="grey"
                    />

                  </div>
                  <div className="flex items-center gap-4">
                    <h3 className="w-24">Technical Jargon</h3>
                    <Progress
                      className="w-full rounded-full custom-progress"
                      percent={responseJSON?.evaluation?.relevantKeywords.technicalJargon}
                      strokeColor="black"
                      trailColor="grey"
                    />

                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-col gap-1">
                  <CardTitle>AI Insights</CardTitle>
                  <CardDescription>Brief, actionable insights provided by the AI.</CardDescription>
                  <div className="flex items-center gap-2">
                    <p className="text-sm">
                      <strong>Strengths:</strong> {responseJSON?.aiInsights.strengths}
                    </p>
                    <p className="text-sm">
                      <strong>Areas for Improvement:</strong> {responseJSON?.aiInsights.areasForImprovement}
                    </p>
                  </div>
                </CardHeader>
                <CardContent className="grid gap-4 text-sm">

                </CardContent>
              </Card>
              
            </div>
          </CardContent>


        </Layout>
      )
  )
}


function CheckCircleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  )
}


function AlertTriangleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </svg>
  )
}

export default FeedbackPage;