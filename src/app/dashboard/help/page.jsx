"use client";

import { useState } from "react";
import DashboardHeader from "@/components/ui/DashboardHeader";
import Sidebar from "@/components/ui/Sidebar";

export default function HelpPage() {
  const [openFAQ, setOpenFAQ] = useState(0);

  const faqs = [
    {
      question: "How do I get started with SeaNeB?",
      answer:
        "To get started, sign up for an account, complete your profile, and list your first property. Our onboarding team will guide you through the process step by step.",
    },
    {
      question: "How can I list a property?",
      answer:
        "Navigate to the Products section, click 'Add New Property', fill in the details, upload high-quality photos, and publish. Your property will be visible to buyers immediately.",
    },
    {
      question: "What are the listing fees?",
      answer:
        "Our pricing varies by plan. Basic plan ($29/month) includes up to 5 listings, Premium ($99/month) includes 25 listings. Contact sales for custom plans.",
    },
    {
      question: "How are leads managed?",
      answer:
        "All inquiries come directly to your dashboard. Use the Lead Management tool to track, respond, and follow up with interested buyers in real-time.",
    },
    {
      question: "Can I edit a listing after publishing?",
      answer:
        "Yes, you can edit any aspect of your listing anytime. Updates are reflected immediately on the platform.",
    },
    {
      question: "How do analytics work?",
      answer:
        "Our Analytics dashboard tracks views, inquiries, and conversion rates for each property. Use this data to optimize your listings and marketing strategy.",
    },
  ];

  const supportChannels = [
    {
      icon: "💬",
      title: "Live Chat",
      description: "Available 24/7",
      contact: "Chat with us",
    },
    {
      icon: "📧",
      title: "Email Support",
      description: "Response within 2 hours",
      contact: "hello@seaneb.org",
    },
    {
      icon: "📞",
      title: "Phone Support",
      description: "Available Mon-Fri 9 AM - 6 PM",
      contact: "+91 (8511) SEANEB",
    },
    {
      icon: "📚",
      title: "Knowledge Base",
      description: "Browse helpful articles",
      contact: "View articles",
    },
  ];

  const commonIssues = [
    {
      icon: "🖼️",
      title: "Photo Upload Issues",
      description:
        "Having trouble uploading property images? Learn about supported formats and sizes.",
    },
    {
      icon: "🔍",
      title: "Listing Not Appearing",
      description:
        "Your listing is not showing up in search? We'll help you troubleshoot visibility issues.",
    },
    {
      icon: "💳",
      title: "Payment Problems",
      description:
        "Experiencing payment issues? Our billing team can assist you with subscription management.",
    },
    {
      icon: "🔐",
      title: "Account Security",
      description:
        "Questions about account security and privacy? Learn about our security measures.",
    },
    {
      icon: "📱",
      title: "Mobile App Issues",
      description:
        "Having issues with the SeaNeB mobile app? Find solutions for common problems.",
    },
    {
      icon: "⚙️",
      title: "Integration Help",
      description:
        "Need help integrating with third-party tools? Check our developer documentation.",
    },
  ];

  return (
    <>
      <DashboardHeader />
      <div className="flex min-h-[calc(100vh-4rem)] bg-gray-50">
        <Sidebar />
        <main className="flex-1 w-full lg:ml-64">
          <div className="p-6 md:p-8 lg:p-8">
            <div className="max-w-7xl mx-auto">
              {/* Header */}
              <div className="mb-10">
                <div className="bg-rose-600 rounded-lg shadow-md p-6 sm:p-8 text-white">
                  <h1 className="text-3xl sm:text-4xl font-bold mb-2">Help & Support</h1>
                  <p className="text-rose-100 text-lg">
                    Get assistance and find answers to your questions
                  </p>
                </div>
              </div>

              {/* Support Channels */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {supportChannels.map((channel, idx) => (
                  <div
                    key={idx}
                    className="bg-white rounded-2xl shadow-md border border-gray-200 p-6 hover:shadow-xl hover:border-rose-300 transition-all duration-300 text-center"
                  >
                    <span className="text-6xl mb-4 block">{channel.icon}</span>
                    <h3 className="font-bold text-gray-900 mb-2 text-lg">
                      {channel.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-6">
                      {channel.description}
                    </p>
                    <button className="w-full px-4 py-3 bg-linear-to-r from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800 text-white font-semibold rounded-lg transition-all shadow-md hover:shadow-lg">
                      {channel.contact}
                    </button>
                  </div>
                ))}
              </div>

              {/* Search Bar */}
              <div className="mb-12">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search help articles..."
                    className="w-full px-6 py-4 border-2 border-gray-300 rounded-2xl focus:border-rose-600 focus:outline-none text-lg shadow-md focus:shadow-lg transition-all"
                  />
                  <button className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    🔍
                  </button>
                </div>
              </div>

              {/* Common Issues */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Common Issues
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {commonIssues.map((issue, idx) => (
                    <div
                      key={idx}
                      className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl hover:border-rose-300 border border-gray-200 transition-all duration-300 cursor-pointer group"
                    >
                      <span className="text-5xl mb-4 block group-hover:scale-110 transition-transform">{issue.icon}</span>
                      <h3 className="font-bold text-gray-900 mb-2 text-lg">
                        {issue.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {issue.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* FAQ Section */}
              <div className="bg-white rounded-3xl shadow-xl border border-gray-200/50 overflow-hidden">
                <div className="p-6 md:p-8 border-b border-gray-200">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Frequently Asked Questions
                  </h2>
                </div>

                <div className="divide-y divide-gray-200">
                  {faqs.map((faq, idx) => (
                    <div key={idx} className="border-b border-gray-200">
                      <button
                        onClick={() =>
                          setOpenFAQ(openFAQ === idx ? -1 : idx)
                        }
                        className="w-full p-6 md:p-8 flex items-center justify-between hover:bg-gray-50 transition-colors text-left"
                      >
                        <span className="font-semibold text-gray-900">
                          {faq.question}
                        </span>
                        <span
                          className={`text-2xl transition-transform duration-200 shrink-0 ml-4 ${
                            openFAQ === idx ? "rotate-180" : ""
                          }`}
                        >
                          ▼
                        </span>
                      </button>

                      {openFAQ === idx && (
                        <div className="px-6 md:px-8 pb-6 md:pb-8 text-gray-600">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Contact Form Section */}
              <div className="mt-12 bg-rose-600 rounded-2xl shadow-lg p-6 md:p-10 text-white">
                <h2 className="text-2xl md:text-3xl font-bold mb-4">
                  Didn&apos;t find what you&apos;re looking for?
                </h2>
                <p className="mb-8 text-rose-100 text-lg">
                  Our support team is ready to help. Send us a message and we&apos;ll
                  get back to you within 2 hours.
                </p>
                <button className="px-8 py-4 bg-white text-rose-600 font-bold rounded-lg hover:bg-gray-50 transition-colors shadow-md hover:shadow-lg">
                  Contact Support
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}


