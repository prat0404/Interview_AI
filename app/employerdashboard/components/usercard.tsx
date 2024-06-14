import React, { useState } from 'react';
import { FaCheck, FaCopy } from 'react-icons/fa';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { CardHeader, CardContent, CardFooter, Card } from "@/components/ui/card"


function CalendarIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
            <line x1="16" x2="16" y1="2" y2="6" />
            <line x1="8" x2="8" y1="2" y2="6" />
            <line x1="3" x2="21" y1="10" y2="10" />
        </svg>
    )
}

function ClockIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
        </svg>
    )
}

interface CardProps {
    avatarText: string;
    name: string;
    role: string;
    submittedDaysAgo: String;
    firebaseVideoUrl?: string | null; // Accept null values
    feedbackLink: string;
    interviewLink: string;
}

const UserCard: React.FC<CardProps> = ({ avatarText, name, role, submittedDaysAgo, firebaseVideoUrl, feedbackLink, interviewLink }) => {
    
    return (
        <div className="container grid gap-4 px-4 py-0 md:grid-cols-[1fr_00px] md:gap-8 lg:px-6">
            <div className="grid gap-4">
                <Card>
                    <CardHeader className="pb-0">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <Avatar className="w-10 h-10">
                                    <div />
                                    <div>{avatarText}</div>
                                </Avatar>
                                <div className="flex flex-col">
                                    <div className="text-base font-bold">{name}</div>
                                    <div className="text-sm">{role}</div>
                                </div>
                            </div>
                            <Button className="white-button" variant="outline">
                                <Link href={interviewLink}>Open Interview Link</Link>
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-5">
                        <div className="grid gap-2">
                            <div className="flex items-center space-x-2">
                                <CalendarIcon className="w-4 h-4 opacity-50" />
                                <time className="text-sm font-semibold">Submitted {submittedDaysAgo} </time>
                            </div>

                        </div>
                    </CardContent>
                    <CardFooter>
                        {firebaseVideoUrl ? (
                            <Button
                                className="black-button"
                                style={{ marginRight: '20px', height: '36px' }}
                                onClick={() => window.open(firebaseVideoUrl, '_blank')}
                            >
                                Play Video
                            </Button>
                        ) : (
                            <Button
                                className="black-button"
                                style={{ marginRight: '20px', height: '36px' }}
                                disabled
                            >
                                No Video Available
                            </Button>
                        )}
                        <Link href={feedbackLink}>
                            <Button className="black-button" style={{ height: '36px' }}>
                                View Feedback
                            </Button>
                        </Link>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
};

export default UserCard;


