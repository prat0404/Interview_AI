"use client";
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar } from "@/components/ui/avatar"
import { CardHeader, CardContent, CardFooter, Card } from "@/components/ui/card"
import Layout from "@/layouts/Layout";
import UserCard from './components/usercard';
import useFirestore from '@/hooks/useFirestore';
import React, { useState, useEffect } from 'react';
import ClipLoader from "react-spinners/ClipLoader";
import { formatDistanceToNow } from 'date-fns';
import { useRouter } from 'next/navigation'; // import useRouter from next/router
import useAuth from '@/hooks/useAuth'; // import the useAuth hook
import { getStorage, ref, getDownloadURL, getMetadata } from "firebase/storage";

interface Interview {
  uuid: string;
  nameofCandidate: string;
  jobTitle: string;
  createdDate: {
    seconds: number;
    nanoseconds: number;
  };
  firebaseVideoUrl?: string; // Add this line
}

export default function Employerdashboard() {
  const storage = getStorage();
  const { getAllInterviews } = useFirestore();
  const [interviews, setInterviews] = useState<Interview[]>([]); // use the Interview type here
  const [loading, setLoading] = useState(true);

  const router = useRouter(); // create an instance of useRouter
  const { user } = useAuth(); // get the user object from useAuth
  const { initializing } = useAuth();

  async function getFirebaseVideoUrl(uuid: string) {
    const videoRef = ref(storage, `videos/${uuid}.webm`);
    try {
      await getMetadata(videoRef); // Check if the file exists
      return await getDownloadURL(videoRef);
    } catch (error) {
      // If the file doesn't exist, return null or a default value
      console.error(`Error getting video URL for ${uuid}:`, error);
      return null;
    }
  }

  const [videoUrls, setVideoUrls] = useState<{ [uuid: string]: string | null }>({});

  useEffect(() => {
    // Fetch all video URLs
    Promise.all(
      interviews.map(interview =>
        getFirebaseVideoUrl(interview.uuid).then(url => ({ uuid: interview.uuid, url }))
      )
    ).then(urls => {
      // Convert the array of URLs to an object for easier access
      const urlObject = urls.reduce<{ [uuid: string]: string | null }>((obj, item) => {
        if (item.url !== null) {
          obj[item.uuid] = item.url;
        }
        return obj;
      }, {});
      setVideoUrls(urlObject);
    });
  }, [interviews]);


  useEffect(() => {
    if (!initializing) { // If onAuthStateChanged has completed
      if (user) { // If user is logged in
        const fetchData = async () => {
          try {
            setLoading(true);
            const dataFromFirebase = await getAllInterviews();
            console.log(dataFromFirebase);
            setInterviews(dataFromFirebase); // update the state with the fetched data
          } catch (error) {
            console.error(error);
          } finally {
            setLoading(false);
          }
        };


        fetchData();
      } else {
        router.push('/login'); // If user is not logged in, redirect to login
      }
    }
  }, [user, initializing]); // This runs every time the 'user' or 'initializing' state changes





  return (
    <Layout>


      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <ClipLoader color="#123abc" loading={loading} size={50} />
        </div>
      ) : (
        <div className="pb-14 space-y-4 bg-white">

          <div className="container grid gap-4 px-4 py-8 md:grid-cols-[1fr_300px] md:gap-8 lg:px-6">

            <div className="grid gap-2">
              <h1 className="text-3xl font-bold tracking-tighter text-black">Candidate Submissions</h1>
              <p className="text-black leading-none md:grid/col">Showing all completed interviews</p>
            </div>

            <div className="grid gap-2">
              <Link href="/create">
                <Button className="w-full black-button" style={{ height: '45px' }} size="lg" variant="outline">
                  New Interview
                </Button>
              </Link>
            </div>
          </div>


          {[...interviews].sort((a, b) => b.createdDate.seconds - a.createdDate.seconds).map((interview, index) => {
            const submittedDate = new Date(interview.createdDate.seconds * 1000);
            const submittedDaysAgo = formatDistanceToNow(submittedDate, { addSuffix: true });

            return (
              <UserCard
                key={index}
                avatarText={interview.uuid.substring(0, 2)}
                name={interview.nameofCandidate}
                role={interview.jobTitle}
                submittedDaysAgo={submittedDaysAgo}
                firebaseVideoUrl={videoUrls[interview.uuid] ?? ''} // Use an empty string as the default value
                feedbackLink={`/feedback/${interview.uuid}`}
                interviewLink={`/${interview.uuid}`}
              />
            );
          })}
        </div>

      )}
    </Layout>


  )
}


function TextIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M17 6.1H3" />
      <path d="M21 12.1H3" />
      <path d="M15.1 18H3" />
    </svg>
  )
}


function ChevronDownIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="m6 9 6 6 6-6" />
    </svg>
  )
}


function CalendarIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
      <line x1="16" x2="16" y1="2" y2="6" />
      <line x1="8" x2="8" y1="2" y2="6" />
      <line x1="3" x2="21" y1="10" y2="10" />
    </svg>
  )
}


function ClockIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  )
}