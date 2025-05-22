import React, { useState } from "react";

const FAQ = () => {
  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">

        {/* Header */}
        <div className="text-center mb-20">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-6">
            Frequently Asked <span className="text-blue-600 dark:text-blue-400">Questions</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Find answers to common questions about ChasmaPasal's services and features.
          </p>
        </div>

        {/* FAQ List */}
        <div className="space-y-6">
          {faqs.map((faq, idx) => (
            <FAQItem key={idx} question={faq.question} answer={faq.answer} />
          ))}
        </div>

      </div>
    </div>
  );
};

// FAQ Item Component
const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex justify-between items-center w-full text-left"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{question}</h3>
        <span className="text-blue-600 dark:text-blue-400 text-xl">
          {isOpen ? "−" : "+"}
        </span>
      </button>
      {isOpen && (
        <p className="mt-4 text-gray-700 dark:text-gray-300 leading-relaxed">
          {answer}
        </p>
      )}
    </div>
  );
};

// FAQ Data
const faqs = [
  {
    question: "What is ChasmaPasal?",
    answer:
      "ChasmaPasal is a digital platform offering virtual try-on for glasses using augmented reality, along with appointment booking with eye specialists and online eyewear purchases."
  },
  {
    question: "How do I book an appointment with a doctor?",
    answer:
      "You can book an appointment by visiting the 'Doctors' section, selecting a doctor, and choosing an available time slot."
  },
  {
    question: "How does the AR try-on feature work?",
    answer:
      "Our AR system uses your device's camera to virtually place glasses on your face in real time, allowing you to see how different frames look before purchasing."
  },
  {
    question: "What payment methods do you support?",
    answer:
      "We support Cash on Delivery (COD) and Khalti digital wallet for secure and easy transactions."
  },
  {
    question: "Can I return or exchange my glasses?",
    answer:
      "Yes, we offer returns and exchanges within 7 days of delivery. The product must be unused and in original condition. Contact us at chasmapasal@gmail.com for details."
  },
  {
    question: "Is my personal data safe?",
    answer:
      "Yes. We prioritize your privacy and follow strict data protection practices. Read our Privacy Policy for more information."
  },
  ];

export default FAQ;
