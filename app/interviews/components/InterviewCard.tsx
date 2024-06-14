import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import CardMedia from "@mui/material/CardMedia";

import { Divider } from "@mui/material";
import FmdGoodOutlinedIcon from "@mui/icons-material/FmdGoodOutlined";
import PaidOutlinedIcon from "@mui/icons-material/PaidOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import WorkOutlineOutlinedIcon from "@mui/icons-material/WorkOutlineOutlined";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";

interface InterviewCardProps {
  interviewData: {
    jobTitle: string;
    companyName: string;
    jobLocation: string;
    majorSkills: string[];
    salary: string;
    dueDate: string;
    companyLogoUrl: string; // Add a new property for the company logo URL
    completedDate?: string; // Add a new property for the completed date
    requiredExperience?: string; // Add a new property for required experience
    modeOfWorking?: string; // Add a new property for mode of working
  };
}

const InterviewCard: React.FC<InterviewCardProps> = ({ interviewData }) => {
  const additionalInfo =
    (interviewData.requiredExperience
      ? `${interviewData.requiredExperience} exp`
      : "") +
    (interviewData.modeOfWorking ? ` • ${interviewData.modeOfWorking}` : "") +
    (interviewData.jobLocation ? ` • ${interviewData.jobLocation}` : "");

  return (
    <Card className="aspect-square mx-auto my-2 bg-white rounded-md overflow-hidden shadow-lg flex flex-col w-80">
      <div className="p-4 flex items-center h-1/3">
        <div
          className="w-1/4 p-1"
          style={{ border: "1px solid slate", borderRadius: "1rem" }}
        >
          <CardMedia
            component="img"
            alt={interviewData.companyName}
            image={
              interviewData.companyLogoUrl ||
              "https://upload.wikimedia.org/wikipedia/commons/6/6c/Facebook_Logo_2023.png"
            }
            // className="w-[80%]"
          />
        </div>
        <div className="flex flex-col w-2/3 pl-4">
          <Typography variant="h6" className="w-full">
            {interviewData.jobTitle}
          </Typography>
          <Typography variant="subtitle2" className="w-full">
            {interviewData.companyName}
          </Typography>
        </div>
      </div>
      <Divider style={{ margin: "2px 20px" }} />
      <CardContent className="flex-grow">
        <Typography
          variant="body2"
          style={{ fontSize: "0.75rem", marginRight: "0.5rem" }}
        >
          <FmdGoodOutlinedIcon
            style={{ fontSize: "0.75rem", marginRight: "0.5rem" }}
          />
          {additionalInfo}
        </Typography>
        <Typography
          variant="body2"
          className="w-full"
          style={{ fontSize: "0.75rem", marginRight: "0.5rem" }}
        >
          <PaidOutlinedIcon
            style={{ fontSize: "0.75rem", marginRight: "0.5rem" }}
          />
          {interviewData.salary}
        </Typography>
        <Typography
          variant="body2"
          style={{ fontSize: "0.75rem", marginRight: "0.5rem" }}
        >
          <CalendarMonthOutlinedIcon
            style={{ fontSize: "0.75rem", marginRight: "0.5rem" }}
          />
          {interviewData.dueDate}
        </Typography>

        <div
          style={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            fontSize: "0.75rem",
            marginRight: "0.5rem",
          }}
        >
          <WorkOutlineOutlinedIcon
            style={{ fontSize: "0.75rem", marginRight: "0.5rem" }}
          />
          {interviewData.majorSkills.join(", ")}
        </div>
      </CardContent>
      <Divider style={{ margin: "2px 20px" }} />
      <div className="flex justify-between p-4">
        {interviewData.completedDate && (
          <Typography
            variant="body2"
            style={{ fontSize: "0.75rem", marginRight: "0.5rem" }}
          >
            <strong>Completed On:</strong>
            <br />
            {interviewData.completedDate}
          </Typography>
        )}
        <Button
          variant="contained"
          color="primary"
          style={{ whiteSpace: "nowrap", padding: "0.5rem 2rem" }}
        >
          Performance
        </Button>
      </div>
    </Card>
  );
};

export default InterviewCard;
