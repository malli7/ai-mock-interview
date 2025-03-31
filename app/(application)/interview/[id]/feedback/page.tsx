"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { db } from '@/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useAuth } from '@clerk/nextjs';
import { ArrowLeft, Trophy, Target, MessageSquare, Brain, Award, Sparkles, TrendingUp, Lightbulb } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface Feedback {
  interviewId: string;
  userId: string;
  totalScore: number;
  categoryScores: {
    name: string;
    score: number;
    comment: string;
  }[];
  areasForImprovement: string[];
  finalAssessment: string;
  createdAt: string;
}

const FeedbackPage = () => {
  const params = useParams();
  const { userId } = useAuth();
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeedback = async () => {
      if (!params.id || !userId) return;

      try {
        const feedbackRef = collection(db, "feedback");
        const q = query(
          feedbackRef,
          where("interviewId", "==", params.id),
          where("userId", "==", userId)
        );
        
        const querySnapshot = await getDocs(q);
        
        if (querySnapshot.empty) {
          setError("No feedback found for this interview. Please complete the interview first.");
          return;
        }

        const feedbackData = querySnapshot.docs[0].data() as Feedback;
        setFeedback(feedbackData);
      } catch (error) {
        console.error("Error fetching feedback:", error);
        setError("Failed to load feedback. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchFeedback();
  }, [params.id, userId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-8 flex items-center justify-center">
        <div className="animate-pulse text-white text-xl">Loading feedback...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-8">
        <div className="max-w-4xl mx-auto">
          <Link 
            href="/dashboard" 
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Dashboard
          </Link>
          <div className="bg-gray-800/50 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-gray-700/50 text-center">
            <p className="text-xl text-gray-300">{error}</p>
            <Link
              href={`/interview/${params.id}`}
              className="inline-flex items-center gap-2 mt-6 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Start Interview
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!feedback) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-8">
        <div className="max-w-4xl mx-auto">
          <Link 
            href="/dashboard" 
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Dashboard
          </Link>
          <div className="bg-gray-800/50 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-gray-700/50 text-center">
            <p className="text-xl text-gray-300">No feedback available</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-indigo-950 p-8">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link 
            href="/dashboard" 
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            Back to Dashboard
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-gray-800/30 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-gray-700/50"
        >
          {/* Overall Score */}
          <div className="flex items-center justify-between mb-12">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-indigo-200 to-white bg-clip-text text-transparent">
                Interview Feedback
              </h1>
              <p className="text-gray-400 mt-2">Your performance analysis and improvement areas</p>
            </div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-400 border border-yellow-500/30 shadow-lg shadow-yellow-500/10"
            >
              <Trophy className="w-6 h-6" />
              <div className="text-right">
                <span className="text-3xl font-bold">{feedback.totalScore}%</span>
                <p className="text-sm text-yellow-400/80">Overall Score</p>
              </div>
            </motion.div>
          </div>

          {/* Category Scores */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {feedback.categoryScores.map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="bg-gray-700/20 rounded-2xl p-6 border border-gray-600/30 hover:border-indigo-500/30 transition-colors"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-200">{category.name}</h3>
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-indigo-400" />
                    <span className="text-xl font-bold text-indigo-400">{category.score}%</span>
                  </div>
                </div>
                <p className="text-gray-400 leading-relaxed">{category.comment}</p>
              </motion.div>
            ))}
          </div>

          {/* Areas for Improvement */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mb-12 bg-gray-700/20 rounded-2xl p-6 border border-gray-600/30"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-full bg-indigo-500/10">
                <Target className="w-5 h-5 text-indigo-400" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-200">Areas for Improvement</h2>
            </div>
            <ul className="space-y-4">
              {feedback.areasForImprovement.map((area, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="flex items-start gap-4 text-gray-300 group"
                >
                  <div className="mt-1 p-1 rounded-full bg-indigo-500/10 group-hover:bg-indigo-500/20 transition-colors">
                    <TrendingUp className="w-4 h-4 text-indigo-400" />
                  </div>
                  <span>{area}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Final Assessment */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-gray-700/20 rounded-2xl p-6 border border-gray-600/30"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-full bg-indigo-500/10">
                <MessageSquare className="w-5 h-5 text-indigo-400" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-200">Final Assessment</h2>
            </div>
            <div className="relative">
              <div className="absolute -top-4 -left-4">
                <Sparkles className="w-8 h-8 text-yellow-400/50" />
              </div>
              <p className="text-gray-300 leading-relaxed pl-4">{feedback.finalAssessment}</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default FeedbackPage;

