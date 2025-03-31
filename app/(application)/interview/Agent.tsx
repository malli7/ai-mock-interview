"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { collection, doc, setDoc } from "firebase/firestore";
import { toast } from "react-hot-toast";

import { cn } from "@/lib/utils";
import { vapi } from "@/lib/vapi";
import { feedbackSchema, interviewer } from "@/constants";
import { generateObject } from "ai";
import { google } from "@ai-sdk/google";
import { db } from "@/firebase";

enum CallStatus {
  INACTIVE = "INACTIVE",
  CONNECTING = "CONNECTING",
  ACTIVE = "ACTIVE",
  FINISHED = "FINISHED",
}

interface SavedMessage {
  role: "user" | "system" | "assistant";
  content: string;
}

interface AgentProps {
  userName: string;
  userId: string;
  interviewId?: string;
  feedbackId?: string;
  type: "generate" | "interview";
  questions?: string[];
  imageUrl?: string;
}

interface Message {
  type: string;
  transcriptType?: string;
  role: "user" | "system" | "assistant";
  transcript: string;
}

interface CreateFeedbackParams {
  interviewId: string;
  userId: string;
  transcript: SavedMessage[];
  feedbackId?: string;
}

const Agent = ({
  userName,
  userId,
  interviewId,
  feedbackId,
  type,
  questions,
  imageUrl,
}: AgentProps) => {
  const router = useRouter();
  const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
  const [messages, setMessages] = useState<SavedMessage[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [lastMessage, setLastMessage] = useState<string>("");
  const [showFeedback, setShowFeedback] = useState(false);
  const [currentFeedbackId, setCurrentFeedbackId] = useState<string | null>(null);

  useEffect(() => {
    const onCallStart = () => {
      setCallStatus(CallStatus.ACTIVE);
    };

    const onCallEnd = () => {
      setCallStatus(CallStatus.FINISHED);
    };

    const onMessage = (message: Message) => {
      if (message.type === "transcript" && message.transcriptType === "final") {
        const newMessage = { role: message.role, content: message.transcript };
        setMessages((prev) => [...prev, newMessage]);
      }
    };

    const onSpeechStart = () => {
      console.log("speech start");
      setIsSpeaking(true);
    };

    const onSpeechEnd = () => {
      console.log("speech end");
      setIsSpeaking(false);
    };

    const onError = (error: Error) => {
      console.log("Error:", error);
    };

    vapi.on("call-start", onCallStart);
    vapi.on("call-end", onCallEnd);
    vapi.on("message", onMessage);
    vapi.on("speech-start", onSpeechStart);
    vapi.on("speech-end", onSpeechEnd);
    vapi.on("error", onError);

    return () => {
      vapi.off("call-start", onCallStart);
      vapi.off("call-end", onCallEnd);
      vapi.off("message", onMessage);
      vapi.off("speech-start", onSpeechStart);
      vapi.off("speech-end", onSpeechEnd);
      vapi.off("error", onError);
    };
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      setLastMessage(messages[messages.length - 1].content);
    }

    const handleGenerateFeedback = async (messages: SavedMessage[]) => {
      console.log("handleGenerateFeedback");

      try {
        if (!userId) {
          throw new Error("User not authenticated");
        }

        if (!interviewId) {
          throw new Error("Interview ID is required");
        }

        if (!messages || messages.length === 0) {
          throw new Error("No interview transcript available");
        }

        console.log("Sending feedback request with:", {
          interviewId,
          userId,
          messageCount: messages.length,
        });

        const response = await fetch("/api/feedback", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            interviewId,
            userId,
            transcript: messages,
            feedbackId,
          }),
        });

        const data = await response.json();
        
        if (!data.success) {
          throw new Error(data.error || "Failed to generate feedback");
        }

        router.push(`/interview/${interviewId}/feedback`);
      } catch (error) {
        console.error("Error saving feedback:", error);
        toast.error(error instanceof Error ? error.message : "Failed to save feedback");
        router.push("/dashboard");
      }
    };

    if (callStatus === CallStatus.FINISHED) {
      if (type === "generate") {
        router.push("/dashboard");
      } else {
        handleGenerateFeedback(messages);
      }
    }
  }, [messages, callStatus, feedbackId, interviewId, router, type, userId]);

  const handleCall = async () => {
    setCallStatus(CallStatus.CONNECTING);

    if (type === "generate") {
      await vapi.start(process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID!, {
        variableValues: {
          username: userName,
          userid: userId,
        },
      });
    } else {
      let formattedQuestions = "";
      if (questions) {
        formattedQuestions = questions
          .map((question) => `- ${question}`)
          .join("\n");
      }

      await vapi.start(interviewer, {
        variableValues: {
          questions: formattedQuestions,
        },
      });
    }
  };

  const handleDisconnect = () => {
    setCallStatus(CallStatus.FINISHED);
    vapi.stop();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="call-view">
          {/* AI Interviewer Card */}
          <div className="card-interviewer">
            <div className="avatar">
              <div className="relative w-[120px] h-[120px] rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <svg
                  className="w-16 h-16 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              {isSpeaking && (
                <span className="absolute inset-0 animate-ping rounded-full bg-indigo-400/30" />
              )}
            </div>
            <h3 className="text-xl font-semibold text-white mt-4">AI Interviewer</h3>
            <p className="text-gray-400 text-sm mt-2">Powered by advanced AI</p>
          </div>

          {/* User Profile Card */}
          <div className="card-border">
            <div className="card-content">
              <div className="relative w-[120px] h-[120px] rounded-full overflow-hidden border-4 border-indigo-500/20">
                <Image
                  src={imageUrl || "/user-avatar.png"}
                  alt="profile-image"
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="text-xl font-semibold text-white mt-4">{userName}</h3>
              <p className="text-gray-400 text-sm mt-2">Interview Candidate</p>
            </div>
          </div>
        </div>

        {messages.length > 0 && (
          <div className="transcript-border mt-8">
            <div className="transcript">
              <p
                key={lastMessage}
                className={cn(
                  "transition-all duration-500 opacity-0 transform translate-y-2",
                  "animate-fadeIn opacity-100 translate-y-0"
                )}
              >
                {lastMessage}
              </p>
            </div>
          </div>
        )}

        <div className="w-full flex justify-center mt-8">
          {callStatus !== "ACTIVE" ? (
            <button
              className={cn(
                "relative px-8 py-4 rounded-full text-white font-medium",
                "bg-gradient-to-r from-indigo-600 to-purple-600",
                "hover:from-indigo-700 hover:to-purple-700",
                "transform transition-all duration-200 hover:scale-105",
                "shadow-lg shadow-indigo-500/20",
                "flex items-center gap-2"
              )}
              onClick={() => handleCall()}
            >
              <span
                className={cn(
                  "absolute inset-0 animate-ping rounded-full bg-indigo-400/30",
                  callStatus !== "CONNECTING" && "hidden"
                )}
              />
              <span className="relative">
                {callStatus === "INACTIVE" || callStatus === "FINISHED"
                  ? "Start Interview"
                  : "Connecting..."}
              </span>
            </button>
          ) : (
            <button
              className={cn(
                "px-8 py-4 rounded-full text-white font-medium",
                "bg-gradient-to-r from-red-600 to-pink-600",
                "hover:from-red-700 hover:to-pink-700",
                "transform transition-all duration-200 hover:scale-105",
                "shadow-lg shadow-red-500/20"
              )}
              onClick={() => handleDisconnect()}
            >
              End Interview
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Agent;

export async function createFeedback(params: CreateFeedbackParams) {
  const { interviewId, userId, transcript, feedbackId } = params;

  try {
    const formattedTranscript = transcript
      .map(
        (sentence: { role: string; content: string }) =>
          `- ${sentence.role}: ${sentence.content}\n`
      )
      .join("");

    const { object } = await generateObject({
      model: google("gemini-2.0-flash-001", {
        structuredOutputs: false
      }),
      schema: feedbackSchema,
      prompt: `
        You are an AI interviewer analyzing a mock interview. Your task is to evaluate the candidate based on structured categories. Be thorough and detailed in your analysis. Don't be lenient with the candidate. If there are mistakes or areas for improvement, point them out.
        Transcript:
        ${formattedTranscript}

        Please score the candidate from 0 to 100 in the following areas. Do not add categories other than the ones provided:
        - **Communication Skills**: Clarity, articulation, structured responses.
        - **Technical Knowledge**: Understanding of key concepts for the role.
        - **Problem-Solving**: Ability to analyze problems and propose solutions.
        - **Cultural & Role Fit**: Alignment with company values and job role.
        - **Confidence & Clarity**: Confidence in responses, engagement, and clarity.
        `,
      system:
        "You are a professional interviewer analyzing a mock interview. Your task is to evaluate the candidate based on structured categories",
    });

    const feedback = {
      interviewId: interviewId,
      userId: userId,
      totalScore: object.totalScore,
      categoryScores: object.categoryScores,
      strengths: object.strengths,
      areasForImprovement: object.areasForImprovement,
      finalAssessment: object.finalAssessment,
      createdAt: new Date().toISOString(),
    };

    let feedbackRef;

    if (feedbackId) {
      feedbackRef = doc(collection(db, "feedback"), feedbackId);
    } else {
      feedbackRef = doc(collection(db, "feedback"));
    }

    await setDoc(feedbackRef, feedback);

    return { success: true, feedbackId: feedbackRef.id };
  } catch (error) {
    console.error("Error saving feedback:", error);
    return { success: false };
  }
}
