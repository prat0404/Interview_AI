"use client";
import useAuth from "@/hooks/useAuth";
import useFirestore from "@/hooks/useFirestore";
import { createUserWithEmailAndPassword } from "firebase/auth";
import Image from "next/image";
import { useState } from "react";
import { auth } from "@/firebase/firebase";
import useWindowSize from "@/hooks/useWindowSize";

export const Register = ({ isRegisterMode, setIsRegisterMode }: any) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistered, setIsRegistered] = useState(false);

  const [loader, setLoader] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");

  const [registrationMessage, setRegistrationMessage] = useState("");

  const [errorMessage, setErrorMessage] = useState("");

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const { setUser } = useAuth();
  const { addUser } = useFirestore();
  const { isMobile } = useWindowSize();

  // const router = useRouter();
  const handleSignUp = async () => {
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    setLoader(true);
    setErrorMessage("");

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      console.log("user", user);

      await addUser({
        uid: user.uid,
        email,
      }).then(() => {
        window.location.href = "/login";
        // router.push("/login");
        console.log("user added");
      });

      setRegistrationMessage("Registration successful! You can now log in.");
    } catch (error: any) {
      setErrorMessage(error.message);
      setLoader(false);
    }
  };

  return (
    <div>
      <div>
        <div>
          <div>
            <div
              className="bg-no-repeat bg-cover bg-center relative"
              style={{
                // backgroundImage: "url(https://images.unsplash.com/photo-1616587894289-86480e533129?q=80&w=3270&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)",
              }}
            >
              <div className="absolute bg-gradient-to-b opacity-75 inset-0 z-0"></div>
              <div className="min-h-screen flex flex-row mx-0 justify-center">
                <div
                  className="flex-col flex  self-center p-10 sm:max-w-5xl xl:max-w-2xl  z-10"
                  style={{
                    display: isMobile ? "none" : "flex",
                  }}
                >
                  <div className="self-start hidden lg:flex flex-col  text-black">
                    <Image src="" className="mb-3" alt="" />
                    <h1 className="mb-3 font-bold text-5xl">
                      Hi! Welcome Back To AutomatedInterview.AI
                    </h1>
                    <p className="pr-3"></p>
                  </div>
                </div>
                <div className="flex justify-center self-center  z-10">
                <div className="p-12 bg-white mx-auto rounded-2xl w-100 border border-grey">
                    <div className="mb-4">
                      <h3 className="font-semibold text-2xl text-gray-800">
                        Sign Up{" "}
                      </h3>
                      <p className="text-gray-500">
                        Proceed to sign up to your account.
                      </p>
                    </div>
                    <div className="space-y-5">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 tracking-wide">
                          Email
                        </label>
                        <input
                          className=" w-full text-base px-4 py-2 border  border-gray-300 rounded-lg focus:outline-none focus:border-blue-400"
                          type="email"
                          placeholder="Email"
                          value={email}
                          autoComplete="off"
                          onChange={(e) => {
                            setIsRegistered(false);
                            setEmail(e.target.value);
                          }} />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 tracking-wide">
                          Password
                        </label>
                        <input
                          className=" w-full text-base px-4 py-2 border  border-gray-300 rounded-lg focus:outline-none focus:border-blue-400"
                          type="password"
                          placeholder="Password"
                          value={password}
                          onChange={(e) => {
                            setIsRegistered(false);
                            setPassword(e.target.value);
                          }}
                          autoComplete="off"
                          maxLength={10} />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 tracking-wide">
                          Confirm Password
                        </label>
                        <input
                          className=" w-full text-base px-4 py-2 border  border-gray-300 rounded-lg focus:outline-none focus:border-blue-400"
                          type="password"
                          placeholder="Confirm Password"
                          value={confirmPassword}
                          onChange={(e) => {
                            setIsRegistered(false);
                            setConfirmPassword(e.target.value);
                          }}
                          autoComplete="off"
                          maxLength={10} />
                      </div>

                      <div className="mt-4">
                        <div>
                          <button
                            type="submit"
                            className={`w-full flex justify-center bg-blue-400  hover:bg-blue-500 text-gray-100 p-3  rounded-full tracking-wide font-semibold  shadow-lg cursor-pointer transition ease-in duration-500 ${loader ? "opacity-50 cursor-not-allowed" : ""}`}
                            onClick={handleSignUp}
                          >
                            {loader ? (
                              <div role="status">
                                <svg
                                  aria-hidden="true"
                                  className="w-4 h-4 text-gray-200 animate-spin dark:text-white fill-blue-700"
                                  viewBox="0 0 100 101"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                    fill="currentColor" />
                                  <path
                                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                    fill="currentFill" />
                                </svg>
                                <span className="sr-only">Signing Up...</span>
                              </div>
                            ) : (
                              "Sign up"
                            )}
                          </button>
                        </div>
                      </div>

                      {errorMessage && (
                        <div className="mt-4">
                          <p className="text-red-500 text-center">
                            {errorMessage}
                          </p>
                        </div>
                      )}

                      {registrationMessage && (
                        <div className="flex justify-center items-center mt-4">
                          <span className="text-black">
                            {registrationMessage}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="pt-5 text-center text-gray-400 text-xs">
                      <div className="text-sm">
                        <button
                          onClick={() => setIsRegisterMode(false)}
                          className="text-blue-400 hover:text-blue-500"
                        >
                          Already have an account? Login here.
                        </button>
                      </div>
                      <span>
                        Copyright © {new Date().getFullYear()}{" "}
                        <a
                          href="https://AutomatedInterview.AI.in"
                          rel=""
                          target="_blank"
                          title="AutomatedInterview.AI"
                          className="text-blue hover:text-blue-500 "
                        >
                          AutomatedInterview.AI
                        </a>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
