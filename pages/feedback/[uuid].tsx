"use client";
import { useRouter } from 'next/router'
import { Progress } from 'antd';
import Layout from "@/layouts/Layout";
import { CardTitle, CardDescription, CardHeader, CardContent, Card } from "@/components/ui/card"
import useFirestore from '@/hooks/useFirestore';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';


export default function FeedbackAnalysis() {

  const router = useRouter()
  const { uuid } = router.query
  const { getInterviewDetails } = useFirestore();
  interface InterviewDetails {
  nameofCandidate: string;
  jobTitle: string;
}

const [interviewDetails, setInterviewDetails] = useState<InterviewDetails | null>(null);
  type FeedbackAnalysis = {
    evaluation: {
      overallSuitability: number;
      communicationSkills: {
        clarity: number;
        articulation: number;
        listeningSkills: number;
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
  const [feedbackAnalysis, setFeedbackAnalysis] = useState<FeedbackAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [noDocument, setNoDocument] = useState(false);
  const [progress, setProgress] = useState(0);
  const Progress = dynamic(() => import('antd').then((mod) => mod.Progress), { ssr: false });

  useEffect(() => {
    const fetchFeedbackAnalysis = async () => {
      setIsLoading(true);
      if (!uuid) {
        // UUID is not defined yet, wait for the next render
        setIsLoading(false);
        return;
      }

      if (typeof uuid === 'string') {
        console.log('Fetching feedback analysis for:', uuid);
        const interviewDetails = await getInterviewDetails(uuid);
setInterviewDetails(interviewDetails);
        console.log('Interview Details:', interviewDetails);
        if (interviewDetails && typeof interviewDetails.feedbackAnalysis === 'string') {
          console.log('feedbackAnalysis:', interviewDetails.feedbackAnalysis);
          try {
            // Find the first { and the last } to extract the JSON part
            const firstBrace = interviewDetails.feedbackAnalysis.indexOf('{');
            const lastBrace = interviewDetails.feedbackAnalysis.lastIndexOf('}');
            const jsonPart = interviewDetails.feedbackAnalysis.slice(firstBrace, lastBrace + 1);
            const parsedFeedbackAnalysis = JSON.parse(jsonPart);
            setFeedbackAnalysis(parsedFeedbackAnalysis);
            console.log('Overall Suitability:', parsedFeedbackAnalysis.evaluation.overallSuitability);
          } catch (error) {
            console.error('Error parsing feedbackAnalysis:', error);
          }
        } else {
          setNoDocument(true);
        }
        setIsLoading(false);
      } else {
        // Handle the case where uuid is not a string
        console.error('UUID is not a string:', uuid);
        setIsLoading(false);
      }
    }

    fetchFeedbackAnalysis();
  }, [uuid]);


  return (
    isLoading ? (
      <div>

      </div>
    ) :
      (
        <Layout>

          {noDocument ? (
            <Card>
              <CardHeader>
                <CardTitle>Candidate has not completed the interview</CardTitle>
              </CardHeader>
              <CardContent>
                <p>The candidate has not completed the interview yet. Please check back later.</p>
              </CardContent>
            </Card>
          ) : (
            <>
              <CardHeader className="flex flex-col gap-1">
                <CardTitle>Interview Feedback</CardTitle>
                <CardDescription>Breakdown of AI-generated scores for a specific candidate&apos;s interview.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-6">

                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-4">
                    <img
                      alt={interviewDetails?.nameofCandidate}
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
                      <h2 className="font-semibold text-lg">{interviewDetails?.nameofCandidate}</h2>
                      <p className="text-sm leading-none text-gray-500 dark:text-gray-400">{interviewDetails?.jobTitle}</p>
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
                        <h1 className="text-5xl font-bold">{feedbackAnalysis?.evaluation?.overallSuitability}%</h1>
                        {feedbackAnalysis?.evaluation?.overallSuitability !== undefined && (
                          <>
                            {feedbackAnalysis.evaluation.overallSuitability > 80 &&
                              <p className="text-sm text-gray-500 dark:text-gray-400">Excellent fit for the role</p>}
                            {feedbackAnalysis.evaluation.overallSuitability <= 80 && feedbackAnalysis.evaluation.overallSuitability > 60 &&
                              <p className="text-sm text-gray-500 dark:text-gray-400">Good fit for the role</p>}
                            {feedbackAnalysis.evaluation.overallSuitability <= 60 &&
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
                          percent={feedbackAnalysis?.evaluation?.communicationSkills.clarity}
                          strokeColor="black"
                          trailColor="grey"
                        />

                      </div>
                      <div className="flex items-center gap-4">
                        <h3 className="w-24">Articulation</h3>
                        <Progress
                          className="w-full rounded-full custom-progress"
                          percent={feedbackAnalysis?.evaluation?.communicationSkills.articulation}
                          strokeColor="black"
                          trailColor="grey"
                        />

                      </div>
                      <div className="flex items-center gap-4">
                        <h3 className="w-24">Listening Skills</h3>
                        <Progress
                          className="w-full rounded-full custom-progress"
                          percent={feedbackAnalysis?.evaluation?.communicationSkills.listeningSkills}
                          strokeColor="black"
                          trailColor="grey"
                          format={percent => <span style={{ color: percent === 100 ? 'black' : 'initial' }}>{percent}%</span>}
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
                          percent={feedbackAnalysis?.evaluation?.relevantKeywords.industryTerms}
                          strokeColor="black"
                          trailColor="grey"
                        />

                      </div>
                      <div className="flex items-center gap-4">
                        <h3 className="w-24">Key Phrases</h3>
                        <Progress
                          className="w-full rounded-full custom-progress"
                          percent={feedbackAnalysis?.evaluation?.relevantKeywords.keyPhrases}
                          strokeColor="black"
                          trailColor="grey"
                        />

                      </div>
                      <div className="flex items-center gap-4">
                        <h3 className="w-24">Technical Jargon</h3>
                        <Progress
                          className="w-full rounded-full custom-progress"
                          percent={feedbackAnalysis?.evaluation?.relevantKeywords.technicalJargon}
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
                          <strong>Strengths:</strong> {feedbackAnalysis?.aiInsights.strengths}
                        </p>
                        <p className="text-sm">
                          <strong>Areas for Improvement:</strong> {feedbackAnalysis?.aiInsights.areasForImprovement}
                        </p>
                      </div>
                    </CardHeader>
                    <CardContent className="grid gap-4 text-sm">

                    </CardContent>
                  </Card>

                </div>
              </CardContent>
            </>

          )}


        </Layout>
      )
  )
}

