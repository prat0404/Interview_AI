"use client";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Image from "next/image";
import {
  titleColor,
  descriptionColor,
  buttonColor,
  buttonHoverColor,
} from "@constants/colors";
import Resume from "../public/resume.png";
import Interview from "../public/interview.png";
import Feedback from "../public/feedback.png";
import Footer from "@/components/Footer";
import Layout from "../layouts/Layout";
import useAuth from "@/hooks/useAuth";
import Link from "next/link";
import React from "react";


// learning

import { Landingpage } from '../components/landingpage'; // replace with the actual path
import  Employerdashboard  from './employerdashboard/page'; // replace with the actual path
import {LoginPage} from '../components/login-page'; // replace with the actual path
import FeedbackPage from './feedback/page'; // replace with the actual path
import ConfirmationPage from './confirm/page'; // replace with the actual path


export default function Home() {
  return <Landingpage />;
}



// export default function Home() {
//   const { user } = useAuth();
//   const padding = "10vh 10vw";

//   const features = [
//     {
//       title: "Tailored Interview Experience",
//       description:
//         "We use AI to tailor the interview experience to your background and experience.",
//       image: Resume,
//       alt: "Resume",
//     },
//     {
//       title: "Interview On-The-Go",
//       description:
//         "Interview on-the-go with our mobile app. Practice anytime, anywhere.",
//       image: Interview,
//       alt: "Interview",
//     },
//     {
//       title: "Personalized Feedback",
//       description: "Get personalized feedback on your interview performance.",
//       image: Feedback,
//       alt: "Feedback",
//     },
//   ];

//   return (
//     <Layout>
//       <div
//         className="flex flex-col text-center justify-center items-center w-screen"
//         style={{
//           padding,
//           // border: "2px solid red",
//         }}
//       >
//         <div className="flex flex-col items-center">
          
          
//           <Typography
//             mt={2}
//             style={{
//               fontSize: "3rem",
//               fontWeight: "bolder",
//               color: titleColor,
//               // border: "2px solid green",
//             }}
//             className="mx-auto"
//           >
//             AutomatedInterview.ai
//           </Typography>




//           <Typography
//             mt={2}
//             style={{
//               fontSize: "2rem",
//               fontWeight: "bolder",
//               color: descriptionColor,
//               // border: "2px solid green",
//             }}
//             className="mx-auto"
//           >
//             Interview On-The-Go
//           </Typography>
//           <Typography
//             mt={2}
//             style={{
//               fontSize: "1rem",
//               // border: "2px solid green",
//             }}
//             className="mx-auto text-gray-500"
//           >
//             Unlocking Potential, One Question at a Time: Your AI Interviewing
//             Companion.
//           </Typography>

//           <Link href={user ? "/interviews" : "/login"}>
//             <Button
//               variant="contained"
//               sx={{
//                 color: "white",
//                 "&:hover": {
//                   backgroundColor: buttonHoverColor,
//                 },
//               }}
//               className="rounded-xl mt-4 w-[100%] mx-auto"
//               style={{
//                 backgroundColor: buttonColor,
//               }}
//             >
//               Get Started
//             </Button>
//           </Link>
//         </div>

//         <div className="flex flex-col mt-10">
//           <Typography
//             mt={2}
//             style={{
//               fontSize: "2.25rem",
//               lineHeight: "2.5rem",
//               fontWeight: "900",
//               color: descriptionColor,
//               // fontFamily: "ui-sans-serif-900",
//               // border: "2px solid green",
//             }}
//             className="mx-auto"
//           >
//             CORE FEATURES
//           </Typography>
//           <div className="flex flex-row justify-evenly items-stretch mt-8">
//             {features.map((feature, index) => (
//               <div key={index} className="flex flex-col w-1/3 h-full flex-grow">
//                 <div className="flex flex-col items-center justify-center h-full">
//                   <Image
//                     src={feature.image}
//                     alt={feature.alt}
//                     className="w-1/4 mx-auto mb-8"
//                   />
//                   <div className="ml-4">
//                     <Typography
//                       style={{
//                         fontSize: "1.5rem",
//                         fontWeight: "900",
//                         color: descriptionColor,
//                       }}
//                       className="mb-4"
//                     >
//                       {feature.title}
//                     </Typography>
//                     <Typography
//                       style={{
//                         fontSize: "1rem",
//                       }}
//                       className="text-gray-500"
//                     >
//                       {feature.description}
//                     </Typography>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         <div
//           className="h-[50vh] bg-[#172554] mt-10 w-screen flex flex-col items-center justify-center"
//           // style={{ padding }}
//         >
//           <Typography
//             mt={2}
//             style={{
//               fontSize: "3rem",
//               fontWeight: "bolder",
//               color: "white",
//               // border: "2px solid green",
//             }}
//             className="mx-auto"
//           >
//             Unlock Your Potential with AutomatedInterview.ai
//           </Typography>

//           <Link href={user ? "/interviews" : "/login"}>
//             <Button
//               variant="contained"
//               className="rounded-xl mt-4 w-[100%] mx-auto"
//               style={{
//                 color: buttonColor,
//                 backgroundColor: "white",
//               }}
//             >
//               Get Started
//             </Button>
//           </Link>
//         </div>
//       </div>
//     </Layout>
//   );
// }


