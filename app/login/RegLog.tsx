"use client";
import useAuth from "@/hooks/useAuth";
import { use, useEffect, useState } from "react";
import { RingLoader } from "react-spinners";
import { Login } from "./components/Login";
import { Register } from "./components/Register";


const App = () => {
  const [isRegisterMode, setIsRegisterMode] = useState(false);

  const { user } = useAuth();
  // const router = useRouter();

  useEffect(() => {
    // Check if the code is running in the browser
    if (typeof window !== "undefined") {
      if (user && !isRegisterMode) {
        console.log(user);
        window.location.href = "/";
        // router.push("/");
      }
    }
  }, [user, isRegisterMode]);

  useEffect(() => {
    // Check if the code is running in the browser
    if (typeof window !== "undefined") {
      // Additional logic if needed
    }
  }, []);

  return (
    <div className="">
      {isRegisterMode ? (
        <Register
          isRegisterMode={isRegisterMode}
          setIsRegisterMode={setIsRegisterMode}
        />
      ) : (
        <Login
          isRegisterMode={isRegisterMode}
          setIsRegisterMode={setIsRegisterMode}
        />
      )}
    </div>
  );
};

export default App;