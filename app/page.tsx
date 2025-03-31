import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center bg-gradient-to-b from-dark-100 to-dark-200 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('/pattern.png')] opacity-10"></div>
        <div className="container mx-auto px-4 z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary-100 to-primary-200">
              Master Technical Interviews
              <br />
              with AI-Powered Practice
            </h1>
            <p className="text-xl md:text-2xl text-light-100 mb-8">
              Get instant feedback, personalized guidance, and real-world interview experience
              with our AI interviewer platform.
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/dashboard" className="btn-primary text-lg px-8 py-4">
                Start Free Practice
              </Link>
           
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-dark-200">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-white mb-16">
            Why Choose Our Platform?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "AI-Powered Interviews",
                description: "Practice with our advanced AI that simulates real technical interviews",
                icon: "🤖"
              },
              {
                title: "Instant Feedback",
                description: "Get detailed feedback on your performance immediately after each session",
                icon: "⚡"
              },
              {
                title: "Progress Tracking",
                description: "Track your improvement over time with detailed analytics",
                icon: "📈"
              }
            ].map((feature, index) => (
              <div key={index} className="card p-8 text-center">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-white mb-4">{feature.title}</h3>
                <p className="text-light-100">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-dark-100">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-white mb-16">
            How It Works
          </h2>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: "1", title: "Sign Up", description: "Create your free account" },
              { step: "2", title: "Choose Topic", description: "Select your interview topic" },
              { step: "3", title: "Practice", description: "Start your AI interview" },
              { step: "4", title: "Improve", description: "Get feedback and improve" }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 bg-primary-200 rounded-full flex items-center justify-center mx-auto mb-4 text-dark-100 font-bold">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-light-100">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-100 to-primary-200">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-dark-100 mb-8">
            Ready to Ace Your Next Interview?
          </h2>
          <p className="text-xl text-dark-100 mb-8">
            Join thousands of developers who have improved their interview skills with our platform
          </p>
          <Link href="/dashboard" className="btn-primary text-lg px-8 py-4 bg-dark-100 text-primary-100 hover:bg-dark-200">
            Get Started Now
          </Link>
        </div>
      </section>
    </div>
  );
}
