"use client";
import { CardTitle, CardDescription, CardHeader, CardContent, CardFooter, Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useState, useEffect } from 'react';
import { FaCopy, FaCheck } from 'react-icons/fa';
import Layout from "@/layouts/Layout";
import { ConfirmCard } from './components/confirmcard';
import { v4 as uuidv4 } from 'uuid';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';



function ConfirmationPage() { // Remove the router prop

  const [copied, setCopied] = useState(false);
  const [uuid, setUuid] = useState('');
  const [jobTitleStr, setJobTitleStr] = useState('');
  const [descriptionStr, setDescriptionStr] = useState<string | null>(null);
  const isServer = typeof window === 'undefined';
  const router = useRouter();
  const searchParams = useSearchParams();
  let interviewData = searchParams ? JSON.parse(searchParams.get('data') || '') : null;
  console.log('interviewData', interviewData);


  return (
    <Layout>
      <div className="flex items-center justify-center min-h-screen">

        {(() => {
          console.log('interviewData', interviewData);

          return (
            <ConfirmCard
              title="Your Interview is Ready"
              description="Your interview has been successfully submitted and is now ready for sharing with candidates."
              assessment={interviewData.jobTitle}
              details={interviewData.description}
              link={`${window.location.origin}/${interviewData.uuid}`}
              dashboardUrl="/employerdashboard"
              createUrl="/create"
            />
          );
        })()}

      </div>
    </Layout>
  );
}

export default function SuspenseWrapper() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ConfirmationPage />
    </Suspense>
  );
}
