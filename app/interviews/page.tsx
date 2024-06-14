//depracted

"use client";
import { useState } from "react";
import Loader from "@/components/Loader";
import { titleColor } from "@/constants/colors";
import useAuth from "@/hooks/useAuth";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { Typography } from "@mui/material";
import Layout from "@/layouts/Layout";
import { Upcoming } from "@mui/icons-material";
import Completed from "./components/Completed";
import React from "react";

const Authentication = () => {
  const [value, setValue] = useState("completed");

  const { user, loading } = useAuth();

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <Layout>
      <div
        className=""
        style={{
          height: "30vh",
          backgroundColor: "#172554",
          justifyContent: "center",
          justifyItems: "center",
          alignItems: "center",
          display: "flex",
        }}
      >
        <Typography
          style={{
            fontSize: "3rem",
            fontWeight: "bolder",
            color: "white",
            textAlign: "center",

            // border: "2px solid green",
          }}
          className="mx-auto"
        >
          Your Interviews
        </Typography>
      </div>



      <div
        className="bg-gray-200"
        style={{ minHeight: "40vh", padding: "5vh 10vw" }}
      >
        <Tabs
          value={value}
          onChange={handleChange}
          TabIndicatorProps={{
            style: {
              backgroundColor: "#172554",
              color: "#172554",
            },
          }}
          // textColor="#172554"
          // indicatorColor="secondary"
          aria-label="secondary tabs example"
          // className="bg-red-500"
          style={{ color: "#172554" }}
        >
          {/* <Tab
            value="upcoming"
            label="Upcoming"
            style={{ color: "#172554" }}
            className="mr-10"
          /> */}
          <Tab
            value="completed"
            label="Completed"
            style={{ color: "#172554" }}
          />
        </Tabs>

        {/* {value === "upcoming" && <Upcoming />} */}
        {value === "completed" && <Completed />}
      </div>
    </Layout>
  );
};

export default Authentication;
