import Link from "next/link"
import { Button } from "@/components/ui/button"
import * as React from 'react';
import Layout from "@/layouts/Layout";
import Employerdashboard from '../app/employerdashboard/page'; // replace with the actual path


export function Landingpage() {
  return (


    <div className="space-y-4 bg-white">
      {/* <div className="bg-gray-950 border-gray-800">
        <div className="container flex items-center justify-between h-14 px-4 md:px-6 mx-auto">
          <Link className="flex items-center space-x-2 text-sm font-medium leading-none" href="#">
            <User2Icon className="h-6 w-6 text-xl" />
            <span className="font-semibold text-white">Your App</span>
          </Link>
          <nav className="hidden md:flex items-center space-x-4">
            <Link
              className="font-medium text-gray-100 hover:underline"
              href="#"
            >
              Features
            </Link>
            <Link
              className="font-medium text-gray-100 hover:underline"
              href="#"
            >
              Pricing
            </Link>
            <Link
              className="font-medium text-gray-100 hover:underline"
              href="#"
            >
              Contact
            </Link>
          </nav>
          <div className="hidden md:flex items-center space-x-4">
            <Link
              className="font-medium text-gray-100 hover:underline"
              href={"/login"}

            >
              Sign in
            </Link>
            <Link
              className="inline-block h-10 w-20 flex items-center justify-center rounded-md border border-gray-800 bg-gray-50 text-gray-900 hover:bg-gray-900/90 border-gray-800"
              href={"/login"}
            >
              Sign up
            </Link>
          </div>
          <div className="md:hidden">
            <Button className="rounded-md p-3">
              <MenuIcon className="h-6 w-6" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </div>
        </div>
      </div> */}


      <Layout>
      <header className="w-full py-12 md:py-15">
          <div className="container mx-auto flex flex-col items-center justify-center text-center px-4 md:px-6 space-y-4">
            <div className="max-w-[600px] text-center">
              <p className="text-sm font-semibold tracking-wide/relaxed text-gray-400">
                AI-POWERED INTERVIEWS
              </p>


              <h1 className="block text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-[7.5rem] text-black text-center mx-auto">
            
                Transform the Hiring Process
              </h1>


              <p className="max-w-[600px] text-gray-400">
                Experience the future of interviews with our AI-powered platform. Streamline your hiring process and
                identify top talent more efficiently.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Link
                 className="black-button" style={{ height: '45px' }}
                href="/employerdashboard"
                onClick={() => console.log('Dashboard link clicked')}
              >
                Dashboard
              </Link>
              <Link
                className="black-button" style={{ height: '45px' }}
                href="/create"
              >
                Create an Interview
              </Link>
            </div>
          </div>
        </header>

      </Layout>
    </div>



  )
}


function User2Icon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="8" r="5" />
      <path d="M20 21a8 8 0 1 0-16 0" />
    </svg>
  )
}

function MenuIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  )
}