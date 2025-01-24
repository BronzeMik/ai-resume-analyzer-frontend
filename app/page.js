"use client";

import { useState } from "react";
import axios from "axios";
import Image from "next/image";
import { RiArrowRightCircleLine } from "react-icons/ri";
import { TiArrowDownOutline } from "react-icons/ti";

export default function Home() {
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file || !jobDescription) {
      alert("Please upload a resume and enter a job description.");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("resume", file);
    formData.append("jobDescription", jobDescription);

    try {
      const response = await axios
        .post("https://ai-resume-analyzer-kohl.vercel.app/api/analyze", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        .then((res) => {
          console.log(res.data.feedback);
          setFeedback(res.data.feedback);
          console.log(feedback);
        });
    } catch (error) {
      console.error("Error uploading file:", error);
      setFeedback({ error: "Error analyzing the resume. Please try again." });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col gap-3 items-center bg-white w-full">
      <div className="flex flex-col md:flex-row items-center md:items-stretch justify-center w-full p-10 h-screen bg-white my-10">
        <div className="flex flex-col justify-center items-center md:items-start w-full md:w-3/5 text-center md:text-left">
          <Image
            src="/resume.gif"
            alt="Resume Analyzer"
            width={300}
            height={300}
            className="mx-auto"
          />
          <h1
            className="text-5xl font-extrabold 
              bg-gradient-to-r from-blue-500 to-purple-600 
              bg-clip-text text-transparent
              tracking-widest 
              uppercase 
              text-center md:text-left
              px-4 rounded-lg"
          >
            AI Resume Analyzer
          </h1>
          <p className="text-gray-700 text-justify mt-4 max-w-2xl">
            Welcome to AI Resume Analyzer – your personal career enhancement
            tool! Our advanced AI technology helps you fine-tune your resume to
            perfectly align with job descriptions, ensuring you stand out in
            today&apos;s competitive job market.
          </p>
          <br />
          <p className="text-gray-700 text-justify mt-4 max-w-2xl">
            Whether you&apos;re applying for your dream job or looking to
            optimize your professional profile, our resume analyzer provides
            personalized feedback on your skills, experience, and formatting.
            Let AI guide you toward crafting a winning resume that catches the
            recruiter&apos;s attention and maximizes your chances of landing
            your next opportunity!
          </p>
        </div>

        <div
          className="flex flex-col items-center justify-center w-full md:w-2/5 h-full border-2 mx-7 bg-gray-100 
          shadow-[5px_5px_15px_rgba(0,0,0,0.2),-5px_-5px_15px_rgba(255,255,255,0.5)] 
          rounded-lg p-6"
        >
          <h2 className="text-3xl mb-10 text-center font-extrabold text-gray-800">
            Upload your resume and job description
          </h2>
          <input
            type="file"
            id="fileUpload"
            onChange={(e) => setFile(e.target.files[0])}
            className="hidden"
          />
          <label
            htmlFor="fileUpload"
            className="cursor-pointer flex items-center justify-center border border-gray-300 rounded-lg shadow-md p-3 bg-white text-gray-700 focus:ring-2 w-[80%] mb-6 focus:ring-blue-500 focus:outline-none hover:bg-gray-100 transition-all duration-300"
          >
            {file ? (
              <span className="truncate">{file.name}</span>
            ) : (
              <span className="text-gray-400">
                Upload your resume (PDF, DOCX)
              </span>
            )}
            <span className="ml-4 bg-blue-500 text-white py-1 px-4 rounded-md shadow hover:bg-blue-600">
              Browse
            </span>
          </label>
          <textarea
            placeholder="Paste job description here..."
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            className="border border-gray-300 rounded-lg shadow-md p-3 w-[80%] h-40 mb-4 bg-white text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <button
            onClick={handleUpload}
            className="bg-purple-600 text-white w-[80%] px-6 py-2 rounded-lg transform hover:translate-y-1 hover:shadow-2xl transition-all duration-300"
            disabled={loading}
          >
            {loading ? "Analyzing..." : "Analyze Resume"}
          </button>
          {feedback && (
            <div className="flex flex-col items-center justify-center mt-6">
            <p className="text-2xl text-gray-700 text-center mt-4">
              Resume Score will be displayed below
              </p>
            <TiArrowDownOutline className="text-4xl text-purple-500 mt-4 animate-bounce" />
          </div>
          )}
          
        </div>
      </div>

      {feedback && (
        <div className="mt-6 p-4 border rounded bg-white w-full">
          <h2
            className="text-6xl font-extrabold
                        
                        bg-gradient-to-r from-blue-500 to-purple-600 
                        bg-clip-text text-transparent
                        tracking-widest 
                        uppercase 
                        text-center 
                        p-4"
          >
            Feedback:
          </h2>
          <div>
            <p className={`${feedback.score > 80 ? "text-green-500" : feedback.score > 50 ? "text-orange-500" : "text-red-700"} font-bold text-4xl`}>
              <strong className="text-black text-4xl uppercase">Score:</strong> {feedback.score}
            </p>
            <p className="mt-12">
              <strong className="mt-2 font-semibold text-gray-800">Suggestions:</strong>{" "}
              {feedback.recommendations.join(", ")}
            </p>
            <br />
            {feedback.recommendations.map((recommenation, index) => (
              <ul key={index}>
                <li className="list-none border-2 border-slate-200 shadow-md w-full px-4 py-3 mt-3 flex justify-start gap-3">
                <RiArrowRightCircleLine className="text-purple-600"/>
                  {recommenation}
                </li>
              </ul>

            ))}
          </div>
          <div className="mt-12">
            <p>
              <strong className="mt-2 font-semibold text-gray-800">Skills Needed:</strong> {feedback.summary}
            </p>
            <br />
              {feedback.missingSkills.map((skill, index) => (
                <ul key={index}>
                  <li className="list-none border-2 border-slate-200 shadow-md w-full px-4 py-3 mt-3 flex justify-start gap-3">
                  <RiArrowRightCircleLine className="text-purple-600"/>
                    {skill}
                  </li>
                </ul>
            ))}

          </div>
          
        </div>
      )}
    </div>
  );
}
