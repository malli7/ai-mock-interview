"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { db } from '@/firebase';
import { doc, getDoc } from 'firebase/firestore';
import Agent from '../Agent';
import { useAuth, useUser } from '@clerk/nextjs';
import { ArrowLeft, Calendar, Code2, Brain, Award, Briefcase } from 'lucide-react';
import Link from 'next/link';

interface Interview {
  id: string;
  role: string;
  level: string;
  type: string;
  createdAt: Date;
  finalized: boolean;
  questions: string[];
  techstack: string[];
  userId: string;
  score?: number;
}

const Page = () => {
  const params = useParams();
  const { userId } = useAuth();
  const { user } = useUser();
  const [interview, setInterview] = useState<Interview | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInterview = async () => {
      if (!params.id) return;

      try {
        const interviewRef = doc(db, "interviews", params.id as string);
        const interviewSnap = await getDoc(interviewRef);
        
        if (interviewSnap.exists()) {
          setInterview({
            id: interviewSnap.id,
            ...interviewSnap.data()
          } as Interview);
        }
      } catch (error) {
        console.error("Error fetching interview:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInterview();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-gray-900 to-purple-950 p-8 flex items-center justify-center">
        <div className="relative">
          <div className="absolute inset-0 bg-indigo-500/20 blur-2xl rounded-full animate-pulse" />
          <div className="relative flex items-center gap-2">
            <div className="w-6 h-6 bg-indigo-500 rounded-full animate-bounce shadow-lg shadow-indigo-500/50" style={{ animationDelay: '0ms' }} />
            <div className="w-6 h-6 bg-indigo-500 rounded-full animate-bounce shadow-lg shadow-indigo-500/50" style={{ animationDelay: '150ms' }} />
            <div className="w-6 h-6 bg-indigo-500 rounded-full animate-bounce shadow-lg shadow-indigo-500/50" style={{ animationDelay: '300ms' }} />
          </div>
        </div>
      </div>
    );
  }

  if (!interview) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-gray-900 to-purple-950 p-8 flex items-center justify-center">
        <div className="text-white text-xl bg-red-500/10 border border-red-500/20 px-8 py-4 rounded-xl backdrop-blur-sm shadow-lg shadow-red-500/20 animate-pulse">
          Interview not found
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-gray-900 to-purple-950 p-8 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl animate-blob" />
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-pink-500/20 rounded-full blur-3xl animate-blob animation-delay-4000" />
      </div>

      <div className="max-w-6xl mx-auto relative">
        {/* Back Button */}
        <Link 
          href="/dashboard" 
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-all hover:translate-x-[-4px] group bg-gray-800/50 px-4 py-2 rounded-full hover:bg-gray-800/80"
        >
          <ArrowLeft className="w-5 h-5 group-hover:translate-x-[-4px] transition-transform" />
          Back to Dashboard
        </Link>

        {/* Main Content */}
        <div className="bg-gray-800/30 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-gray-700/30 hover:border-indigo-500/30 transition-all duration-300 relative overflow-hidden">
          {/* Animated border gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/0 via-indigo-500/10 to-indigo-500/0 animate-gradient-x" />
          
          {/* Header */}
          <div className="flex items-center justify-between mb-8 relative">
            <div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-400 via-white to-purple-400 bg-clip-text text-transparent animate-gradient">
                {interview.role} Interview
              </h1>
              <div className="flex items-center gap-4 mt-4 text-gray-400">
                <div className="flex items-center gap-2 bg-gray-800/50 px-4 py-2 rounded-full hover:bg-gray-800/80 transition-all duration-300 hover:scale-105">
                  <Calendar className="w-5 h-5 text-indigo-400" />
                  {new Date(interview.createdAt).toLocaleDateString()}
                </div>
                <div className="flex items-center gap-2 bg-gray-800/50 px-4 py-2 rounded-full hover:bg-gray-800/80 transition-all duration-300 hover:scale-105">
                  <Briefcase className="w-5 h-5 text-indigo-400" />
                  {interview.level}
                </div>
                {interview.score && (
                  <div className="flex items-center gap-2 bg-gray-800/50 px-4 py-2 rounded-full hover:bg-gray-800/80 transition-all duration-300 hover:scale-105">
                    <Award className="w-5 h-5 text-indigo-400" />
                    {interview.score}% Score
                  </div>
                )}
              </div>
            </div>
            <div className="px-6 py-3 rounded-full bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-indigo-400 border border-indigo-500/30 hover:border-indigo-500/50 transition-all duration-300 hover:scale-105 shadow-lg shadow-indigo-500/20">
              {interview.type}
            </div>
          </div>
          
          {/* Tech Stack */}
          <div className="mb-8 relative">
            <div className="flex items-center gap-2 mb-4">
              <Code2 className="w-6 h-6 text-indigo-400" />
              <h2 className="text-2xl font-semibold text-gray-300">Tech Stack</h2>
            </div>
            <div className="flex flex-wrap gap-3">
              {interview.techstack.map((tech) => (
                <span
                  key={tech}
                  className="px-5 py-2.5 text-sm rounded-full bg-gradient-to-r from-indigo-500/10 to-purple-500/10 text-indigo-400 border border-indigo-500/20 hover:border-indigo-500/40 hover:bg-indigo-500/20 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-indigo-500/20"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Interview Agent */}
          <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl p-8 border border-gray-700/30 hover:border-indigo-500/30 transition-all duration-300 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/0 via-indigo-500/5 to-indigo-500/0 animate-gradient-x" />
            <div className="flex items-center gap-2 mb-6 relative">
              <Brain className="w-6 h-6 text-indigo-400" />
              <h2 className="text-2xl font-semibold text-gray-300">Interview Session</h2>
            </div>
            <Agent 
              questions={interview.questions}
              userName={user?.fullName || "User"}
              type="interview"
              imageUrl={user?.imageUrl || ""}
              userId={userId!}
              interviewId={params.id as string}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
