import React from "react";
import Typography from "@mui/material/Typography";
import EmailIcon from "@mui/icons-material/Email";
import { Instagram } from "@mui/icons-material";

const Footer = () => {
  return (
    <footer className="p-4 text-white text-center bg-black to-purple-500 mt-0">
      <div className="flex items-center justify-center space-x-10 mb-6">
        <a href="mailto:info@automatedinterview.com" className="hover:text-blue-200 transition duration-300 ease-in-out">
          <EmailIcon />
        </a>
        <a href="https://www.instagram.com/automatedinterview" className="hover:text-blue-200 transition duration-300 ease-in-out">
          <Instagram />
        </a>
      </div>
      <Typography variant="body2" className="mt-2 font-sans">
        © 2024 AutomatedInterview. All rights reserved.
      </Typography>
    </footer>
  );
};

export default Footer;
