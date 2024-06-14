import React from "react";
import InterviewCard from "./InterviewCard";

const interviewData = [
  {
    jobTitle: "Software Engineer",
    companyName: "TechCo Inc.",
    jobLocation: "Bangalore",
    majorSkills: ["JavaScript", "React", "Node.js"],
    salary: "₹8,00,000 - ₹10,00,000 per year",
    dueDate: "2024-02-15",
    completedDate: "2024-02-14",
    companyLogoUrl:
      "https://upload.wikimedia.org/wikipedia/commons/6/6c/Facebook_Logo_2023.png",
    requiredExperience: "2+ years",
    modeOfWorking: "Hybrid",
  },
  {
    jobTitle: "Data Scientist",
    companyName: "Data Insights Corp.",
    jobLocation: "Mumbai",
    majorSkills: ["Python", "Machine Learning", "Data Analysis"],
    salary: "₹9,00,000 - ₹12,00,000 per year",
    dueDate: "2024-02-28",
    completedDate: "2024-02-27",
    companyLogoUrl:
      "https://upload.wikimedia.org/wikipedia/commons/6/6c/Facebook_Logo_2023.png",
    requiredExperience: "3+ years",
    modeOfWorking: "Remote",
  },
  {
    jobTitle: "UX Designer",
    companyName: "Design Studios Ltd.",
    jobLocation: "Chennai",
    majorSkills: ["UI/UX Design", "Prototyping", "Adobe XD"],
    salary: "₹7,00,000 - ₹9,00,000 per year",
    dueDate: "2024-03-10",
    completedDate: "2024-03-09",
    companyLogoUrl:
      "https://upload.wikimedia.org/wikipedia/commons/6/6c/Facebook_Logo_2023.png",
    requiredExperience: "2+ years",
    modeOfWorking: "Hybrid",
  },
  {
    jobTitle: "Marketing Specialist",
    companyName: "Market Masters Agency",
    jobLocation: "Delhi",
    majorSkills: ["Digital Marketing", "SEO", "Social Media"],
    salary: "₹6,00,000 - ₹8,00,000 per year",
    dueDate: "2024-03-15",
    completedDate: "2024-03-14",
    companyLogoUrl:
      "https://upload.wikimedia.org/wikipedia/commons/6/6c/Facebook_Logo_2023.png",
    requiredExperience: "2+ years",
    modeOfWorking: "Remote",
  },
  {
    jobTitle: "Project Manager",
    companyName: "Project Solutions Inc.",
    jobLocation: "Hyderabad",
    majorSkills: ["Project Management", "Agile", "Communication"],
    salary: "₹8,50,000 - ₹11,00,000 per year",
    dueDate: "2024-03-20",
    completedDate: "2024-03-19",
    companyLogoUrl:
      "https://upload.wikimedia.org/wikipedia/commons/6/6c/Facebook_Logo_2023.png",
    requiredExperience: "4+ years",
    modeOfWorking: "Hybrid",
  },
  {
    jobTitle: "Software Engineer",
    companyName: "TechCo Inc.",
    jobLocation: "Bangalore",
    majorSkills: ["JavaScript", "React", "Node.js"],
    salary: "₹8,00,000 - ₹10,00,000 per year",
    dueDate: "2024-02-15",
    completedDate: "2024-02-14",
    companyLogoUrl:
      "https://upload.wikimedia.org/wikipedia/commons/6/6c/Facebook_Logo_2023.png",
    requiredExperience: "2+ years",
    modeOfWorking: "Hybrid",
  },
  {
    jobTitle: "Data Scientist",
    companyName: "Data Insights Corp.",
    jobLocation: "Mumbai",
    majorSkills: ["Python", "Machine Learning", "Data Analysis"],
    salary: "₹9,00,000 - ₹12,00,000 per year",
    dueDate: "2024-02-28",
    completedDate: "2024-02-27",
    companyLogoUrl:
      "https://upload.wikimedia.org/wikipedia/commons/6/6c/Facebook_Logo_2023.png",
    requiredExperience: "3+ years",
    modeOfWorking: "Remote",
  },
  {
    jobTitle: "UX Designer",
    companyName: "Design Studios Ltd.",
    jobLocation: "Chennai",
    majorSkills: ["UI/UX Design", "Prototyping", "Adobe XD"],
    salary: "₹7,00,000 - ₹9,00,000 per year",
    dueDate: "2024-03-10",
    completedDate: "2024-03-09",
    companyLogoUrl:
      "https://upload.wikimedia.org/wikipedia/commons/6/6c/Facebook_Logo_2023.png",
    requiredExperience: "2+ years",
    modeOfWorking: "Hybrid",
  },
  {
    jobTitle: "Marketing Specialist",
    companyName: "Market Masters Agency",
    jobLocation: "Delhi",
    majorSkills: ["Digital Marketing", "SEO", "Social Media"],
    salary: "₹6,00,000 - ₹8,00,000 per year",
    dueDate: "2024-03-15",
    completedDate: "2024-03-14",
    companyLogoUrl:
      "https://upload.wikimedia.org/wikipedia/commons/6/6c/Facebook_Logo_2023.png",
    requiredExperience: "2+ years",
    modeOfWorking: "Remote",
  },
  {
    jobTitle: "Project Manager",
    companyName: "Project Solutions Inc.",
    jobLocation: "Hyderabad",
    majorSkills: ["Project Management", "Agile", "Communication"],
    salary: "₹8,50,000 - ₹11,00,000 per year",
    dueDate: "2024-03-20",
    completedDate: "2024-03-19",
    companyLogoUrl:
      "https://upload.wikimedia.org/wikipedia/commons/6/6c/Facebook_Logo_2023.png",
    requiredExperience: "4+ years",
    modeOfWorking: "Hybrid",
  },
  // Repeat the data for more examples
];
function Completed() {
  return (
    <div className="flex flex-wrap justify-start">
      {interviewData.map((interview, index) => (
        <InterviewCard interviewData={interview} key={index} />
      ))}

      {/* <InterviewCard interviewData={interviewData} /> */}
    </div>
  );
}

export default Completed;
