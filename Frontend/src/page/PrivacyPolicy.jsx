import React from "react";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">

        {/* Header Section */}
        <div className="text-center mb-20">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-6">
            Privacy <span className="text-blue-600 dark:text-blue-400">Policy</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Your privacy is important to us. This policy explains how ChasmaPasal collects, uses, and protects your data.
          </p>
        </div>

        {/* Main Content */}
        <div className="space-y-16">
          <SectionCard title="Information We Collect">
            We collect personal information such as name, email, contact number, and prescription details when you register or book appointments. We also collect technical data like IP address and browser information through cookies to improve your user experience.
          </SectionCard>

          <SectionCard title="How We Use Your Information">
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li>To provide services like virtual try-on, appointment booking, and order fulfillment.</li>
              <li>To improve user experience through analytics and feedback.</li>
              <li>To communicate important updates, promotions, and support.</li>
            </ul>
          </SectionCard>

          <SectionCard title="How We Protect Your Information">
            Your data security is our priority. We use industry-standard encryption, secure servers, and restricted access policies to protect your personal information from unauthorized access, disclosure, or misuse.
          </SectionCard>

          <SectionCard title="Third-Party Services">
            We may use third-party services (like payment gateways and analytics tools) which have their own privacy policies. We ensure all third-party partners align with our data protection standards.
          </SectionCard>

          <SectionCard title="Your Rights">
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li>Access or request deletion of your personal data.</li>
              <li>Update your personal details through your account settings.</li>
              <li>Opt out of marketing communications at any time.</li>
            </ul>
          </SectionCard>

          <SectionCard title="Policy Updates">
            We may update our privacy policy to reflect changes in regulations or our services. You will be notified of major updates through email or a banner on our website.
          </SectionCard>

          <SectionCard title="Contact Us">
            For questions or concerns about this policy, contact us at:
            <br />
            <span className="font-medium text-blue-600 dark:text-blue-400">
              chasmapasal1@gmail.com
            </span>
          </SectionCard>

          <div className="bg-blue-600 dark:bg-blue-800 p-8 rounded-2xl shadow-lg text-center mt-12">
            <p className="text-xl text-white leading-relaxed">
              We respect your privacy and are committed to protecting your personal data with transparency and care.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

// Reusable Section Card Component
const SectionCard = ({ title, children }) => (
  <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-md">
    <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white flex items-center">
      <span className="w-3 h-3 bg-blue-600 rounded-full mr-3"></span>
      {title}
    </h2>
    <div className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
      {children}
    </div>
  </div>
);

export default PrivacyPolicy;
