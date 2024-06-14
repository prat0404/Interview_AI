import React from "react";
import InterviewCard from "./InterviewCard";

const interviewData = {
  jobTitle: "Software Engineer",
  companyName: "TechCo Inc.",
  jobLocation: "San Francisco, CA",
  majorSkills: ["JavaScript", "React", "Node.js"],
  salary: "$80,000 - $100,000 per year",
  dueDate: "2024-02-15",
  companyLogoUrl:
    "https://upload.wikimedia.org/wikipedia/commons/6/6c/Facebook_Logo_2023.png",
};

function Upcoming() {
  return <div>{/* <InterviewCard interviewData={interviewData} /> */}</div>;
}

export default Upcoming;
