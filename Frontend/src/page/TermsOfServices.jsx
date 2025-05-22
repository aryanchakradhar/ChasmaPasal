import React from "react";

const TermsOfService = () => {
  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">

        {/* Header */}
        <div className="text-center mb-20">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-6">
            Terms of <span className="text-blue-600 dark:text-blue-400">Service</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Please read these terms and conditions carefully before using ChasmaPasal.
          </p>
        </div>

        {/* Main Content */}
        <div className="space-y-16">
          <SectionCard title="Acceptance of Terms">
            By accessing or using ChasmaPasal, you agree to comply with and be bound by these Terms of Service. If you do not agree, please do not use our services.
          </SectionCard>

          <SectionCard title="Use of Services">
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li>Our platform is intended for individuals aged 18 or above, or under supervision of a guardian.</li>
              <li>You agree to provide accurate and complete information during registration or purchases.</li>
              <li>You are responsible for maintaining the confidentiality of your account and password.</li>
            </ul>
          </SectionCard>

          <SectionCard title="User Conduct">
            You agree not to:
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li>Use our services for any unlawful or harmful activity.</li>
              <li>Upload or share misleading, offensive, or infringing content.</li>
              <li>Interfere with or disrupt the platform’s operations or security.</li>
            </ul>
          </SectionCard>

          <SectionCard title="Orders & Appointments">
            All orders and appointments are subject to availability and acceptance. We reserve the right to cancel or reschedule due to unforeseen issues or violations of these terms.
          </SectionCard>

          <SectionCard title="Intellectual Property">
            All content, logos, and designs are the intellectual property of ChasmaPasal. Unauthorized use, reproduction, or distribution is strictly prohibited.
          </SectionCard>

          <SectionCard title="Third-Party Links">
            Our platform may contain links to external websites. We are not responsible for the content or practices of those third-party services.
          </SectionCard>

          <SectionCard title="Limitation of Liability">
            ChasmaPasal is not liable for any indirect, incidental, or consequential damages arising from your use of our services. Our liability is limited to the maximum extent permitted by law.
          </SectionCard>

          <SectionCard title="Changes to Terms">
            We reserve the right to modify these Terms of Service at any time. Any changes will be posted on this page and, where appropriate, notified to you via email or platform notice.
          </SectionCard>

          <SectionCard title="Governing Law">
            These terms shall be governed and construed in accordance with the laws of Nepal, without regard to its conflict of law provisions.
          </SectionCard>

          <SectionCard title="Contact Us">
            If you have any questions about these Terms, contact us at:
            <br />
            <span className="font-medium text-blue-600 dark:text-blue-400">chasmapasal1@gmail.com</span>
          </SectionCard>

          <div className="bg-blue-600 dark:bg-blue-800 p-8 rounded-2xl shadow-lg text-center mt-12">
            <p className="text-xl text-white leading-relaxed">
              By using ChasmaPasal, you agree to these terms and help us create a secure, respectful, and trustworthy platform.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

// Reusable SectionCard Component
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

export default TermsOfService;
