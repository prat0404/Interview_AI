"use client";
import { CardTitle, CardDescription, CardHeader, CardContent, Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import useAuth from '@/hooks/useAuth';
import React, { ComponentType, useEffect } from 'react';
import { AiFillDelete } from 'react-icons/ai';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import useFirestore from '@/hooks/useFirestore';
import { useSearchParams } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Layout from '@/layouts/Layout';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { DropzoneArea } from 'material-ui-dropzone';
import { AiFillFilePdf } from 'react-icons/ai';
import { PDFReader } from 'react-pdftotext';
import {pdfToText} from 'pdf-ts';

export default function Create() {
  const [questions, setQuestions] = useState<string[]>([]);
  const [newQuestion, setNewQuestion] = useState('');
  const router = useRouter();
  const [jobTitle, setJobTitle] = useState('');
  const [nameofCandidate, setNameofCandidate] = useState('');
  const [description, setDescription] = useState('');
  const [keywords, setKeywords] = useState('');
  const { addUserDetails } = useFirestore();

  const [uuid, setUuid] = useState('');


  const { user } = useAuth(); // get the user object from useAuth
  const { initializing } = useAuth();

  const [pdfFile, setPdfFile] = useState<File | null>(null);
const [pdfText, setPdfText] = useState<string | null>(null);
  const [pdfFileName, setPdfFileName] = useState<string | null>(null);

const handleFileChange = async (files: File[]) => {
  if (files.length > 0) {
    setPdfFile(files[0]);
    setPdfFileName(files[0]?.name || null);

    // Read the PDF file and console its text
    const reader = new FileReader();
    reader.onload = async (event) => {
      if (event.target?.result) {
        const text = await pdfToText(new Uint8Array(event.target.result as ArrayBuffer));
        console.log(text);
        setPdfText(text); // Set the pdfText state
      }
    };
    reader.readAsArrayBuffer(files[0]);
  }
};



  useEffect(() => {
    if (!initializing) { // If onAuthStateChanged has completed
      if (!user) { // If user is not logged in
        router.push('/login'); // redirect to login
      }
    }
  }, [user, initializing]); // This runs every time the 'user' or 'initializing' state changes


  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log('Submitting form');

    const interviewData = {
      nameofCandidate,
      jobTitle,
      description,
      keywords: keywords.split(','),
      questions,
      uuid: uuidv4(),
      pdfText,
    };

    try {
      console.log('Sending the following data to Firestore:', interviewData);
      await addUserDetails(interviewData);
      console.log('Interview details added successfully');
      const data = JSON.stringify(interviewData);
      console.log('data', data);
      router.push(`/confirm?data=${encodeURIComponent(data)}`);

    } catch (error) {
      console.error('Error adding interview details:', error);
    }
  };


  const handleAddQuestion = (e: React.MouseEvent<HTMLButtonElement>) => {
    setQuestions(prevQuestions => [...prevQuestions, newQuestion]);
    setNewQuestion('');
  };
  const handleDeleteQuestion = (indexToDelete: number) => {
    setQuestions(prevQuestions => prevQuestions.filter((_, index) => index !== indexToDelete));
  };


  return (
    <Layout>
      <form onSubmit={handleSubmit}>
        <div style={{ paddingBottom: '50px' }}>
          <CardHeader>
            <CardTitle className="text-xl">Interview details</CardTitle>
            <CardDescription>Enter basic details for your interview.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6 pt-6">
            <div className="space-y-2">
              <Label htmlFor="candidate-name">Name of candidate</Label>
              <Input
                id="candidate-name"
                placeholder="Enter candidate name"
                required
                value={nameofCandidate}
                onChange={(e) => setNameofCandidate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="job-title">Job title</Label>
              <Input
                id="job-title"
                placeholder="Enter job title"
                required
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Job Description</Label>
              <Textarea
                id="description"
                placeholder="Enter description"
                required
                style={{ backgroundColor: 'white' }}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="keywords">Keywords</Label>
              <Input
                id="keywords"
                placeholder="Enter keywords"
                required
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
              />
              {/* comma seperated grey text small text*/}
              <p className="text-gray-500 text-sm">Comma separated keywords</p>
            </div>


            <div className="space-y-2">
              <Label htmlFor="questions">Questions</Label>
              {questions.map((question, index) => (
                <div key={index} className="flex justify-between items-center">
                  <Input
                    value={question}
                    readOnly
                    style={{ backgroundColor: 'white' }}
                  />
                  <Button onClick={() => handleDeleteQuestion(index)}>
                    <DeleteIcon />
                  </Button>
                </div>
              ))}

              <div className="flex space-x-2">
                <Input
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  placeholder="Add new question"
                />
                {/* React icon plus */}
                <Button type="button" onClick={handleAddQuestion}>
                  <AddIcon />
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="pdf">Resume</Label>
              {pdfFileName ? (
                <div className="border rounded-lg p-4 flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <AiFillFilePdf className="text-red-600 text-3xl" />
                    <div>
                      <p className="font-semibold">{pdfFileName}</p>
                      <p className="text-sm text-gray-500">PDF File</p>
                    </div>
                  </div>
                  <Button onClick={() => {
                    setPdfFile(null);
                    setPdfFileName(null);
                  }}>
                    <AiFillDelete className="text-red-500" size={20} />
                  </Button>
                </div>
              ) : (
                <DropzoneArea
                  acceptedFiles={['application/pdf']}
                  filesLimit={1}
                  onChange={handleFileChange}
                  showPreviewsInDropzone={false}
                  dropzoneText={"Drag and drop a PDF here or click"}
                />
              )}
            </div>

          </CardContent>

          <div className="mx-auto max-w-3xl grid gap-4 px-4 lg:grid-cols-2">

            <Link href="/">
              <Button className="black-button" style={{ height: '50px', width: '100%', backgroundColor: 'red' }}>
                Cancel
              </Button>
            </Link>




            <Button type="submit" className="black-button" style={{ height: '50px', width: '100%' }}>
              Submit
            </Button>

          </div>

        </div>

      </form>
    </Layout >
  )
}
