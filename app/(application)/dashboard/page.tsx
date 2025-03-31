"use client";
import { UserButton, useAuth } from "@clerk/nextjs";
import React, { useEffect, useState } from "react";
import { ArrowUpRight, Trophy, Plus, Clock, Code2, Brain } from "lucide-react";
import { db } from "@/firebase";
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";
import Link from "next/link";
import { useRouter } from "next/navigation";

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

function DashboardPage() {
  const { userId } = useAuth();
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchInterviews = async () => {
      if (!userId) return;

      const interviewsRef = collection(db, "interviews");
      const q = query(interviewsRef, where("userId", "==", userId));
      const querySnapshot = await getDocs(q);
      const fetchedInterviews = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Interview[];

      setInterviews(fetchedInterviews);
      setLoading(false);
    };

    fetchInterviews();
  }, [userId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-8 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Your Interviews</h1>
            <p className="text-gray-400 mt-1">Track your interview progress</p>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/interview"
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Start New Interview
            </Link>
            <UserButton />
          </div>
        </div>

        {/* Interview Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {interviews.map((interview) => (
            <div
              key={interview.id}
              className="relative group bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl rounded-2xl p-6 hover:transform hover:scale-105 transition-all duration-300 border border-indigo-500/20 shadow-lg hover:shadow-indigo-500/20"
              onClick={() => router.push(`/interview/${interview.id}`)}
            >
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Header */}
              <div className="relative flex justify-between items-start mb-6">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                      {interview.role}
                    </h2>
                    <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                      {interview.level}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Clock className="w-4 h-4" />
                    {new Date(interview.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-sm font-medium border border-indigo-500/20">
                    {interview.type}
                  </div>
                  {interview.score !== undefined && (
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-yellow-500/10 to-orange-500/10 text-yellow-400 text-sm font-medium border border-yellow-500/20">
                      <Trophy className="w-4 h-4" />
                      {interview.score}%
                    </div>
                  )}
                </div>
              </div>

              {/* Tech Stack */}
              <div className="relative mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <Code2 className="w-4 h-4 text-indigo-400" />
                  <span className="text-sm font-medium text-gray-300">
                    Tech Stack
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {interview.techstack.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 text-xs rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 hover:bg-indigo-500/20 transition-colors"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Questions */}
              <div className="relative">
                <div className="flex items-center gap-2 mb-3">
                  <Brain className="w-4 h-4 text-indigo-400" />
                  <span className="text-sm font-medium text-gray-300">
                    Questions
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">
                    {interview.questions.length} Questions
                  </span>
                  <div className="flex gap-2">
                    {interview.score !== undefined && (
                      <Link
                        href={`/interview/${interview.id}/feedback`}
                        className="bg-green-500/10 p-2 rounded-lg group-hover:bg-green-500/20 transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Trophy className="w-5 h-5 text-green-400" />
                      </Link>
                    )}
                    <div className="bg-indigo-500/10 p-2 rounded-lg group-hover:bg-indigo-500/20 transition-colors">
                      <ArrowUpRight className="w-5 h-5 text-indigo-400" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {interviews.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400">
              No interviews found. Start your first interview!
            </p>
            <Link
              href="/interview"
              className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Start Interview
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default DashboardPage;
