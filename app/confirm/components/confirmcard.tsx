import { CardTitle, CardDescription, CardHeader, CardContent, CardFooter, Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useState } from 'react';
import { FaCopy, FaCheck } from 'react-icons/fa';

interface ConfirmCardProps {
  title: string;
  description: string;
  assessment: string;
  details: string;
  link: string;
  dashboardUrl: string;
  createUrl: string;
}

export const ConfirmCard: React.FC<ConfirmCardProps> = ({ title, description, assessment, details, link, dashboardUrl, createUrl }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
  };

  return (
    <Card className="w-full max-w-3xl p-0">
      <CardHeader className="flex items-start pb-6 space-y-0">
        <div className="space-y-1.5">
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-1.5">
          <h3 className="font-medium">{assessment}</h3>
          <p className="text-sm leading-normal text-gray-500 dark:text-gray-400">{details}</p>
        </div>

        <div className="flex items-center rounded-lg border border-gray-200 bg-gray-50">
          <Input
            className="rounded-lg border-0 w-full"
            id="interview-link"
            value={link}
          />
          <Button className="px-7 rounded-r-lg bg-white text-black" variant="outline" onClick={handleCopy}>
            {copied ? <FaCheck /> : <FaCopy />}
          </Button>
        </div>
      </CardContent>
      <CardFooter className="flex">
        <Link className="flex-1" href={dashboardUrl}>
          <Button className="white-button w-full" variant="outline">
            View Dashboard
          </Button>
        </Link>
        <Link className="flex-1 ml-2" href={createUrl}>
          <Button className="black-button w-full">Create Another Interview</Button>
        </Link>
      </CardFooter>
    </Card>
  )
}