const AboutUs = () => {
  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        
        {/* Hero Section */}
        <div className="text-center mb-20">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-6">
            About <span className="text-blue-600 dark:text-blue-400">ChasmaPasal</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Revolutionizing eye care through augmented reality and innovative technology
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          
          {/* Left Section */}
          <div className="lg:col-span-2 space-y-16">
            
            {/* Introduction */}
            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-md">
              <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                ChasmaPasal is a state-of-the-art healthcare platform that merges the latest advancements in augmented reality (AR) with eye care services. Our solution transforms traditional eye care by offering a smooth and innovative experience for both patients and healthcare providers.
              </p>
            </div>

            {/* Our Mission */}
            <SectionCard title="Our Mission">
              At ChasmaPasal, our goal is to bridge the gap between traditional eye care practices and modern technological innovations. We are dedicated to providing accessible, efficient, and customized eye care solutions by incorporating augmented reality, ensuring a high level of satisfaction and well-being for our users.
            </SectionCard>

            {/* Our Team */}
            <SectionCard title="Our Team">
              We are a passionate team of experts focused on reshaping the eye care industry. ChasmaPasal brings together professionals from healthcare, technology, and design to create a platform that not only upholds the highest standards of quality but is also adaptable to the evolving needs of the healthcare sector.
            </SectionCard>

            {/* Why Choose Us */}
            <SectionCard title="Why Choose ChasmaPasal">
              <ul className="space-y-6 mt-6">
                {[
                  { title: "Advanced Technology", desc: "Utilizing AR for an engaging and interactive virtual eyeglass try-on experience." },
                  { title: "Focus on Patients", desc: "Prioritizing user-friendly scheduling, personalized consultations, and overall satisfaction." },
                  { title: "Streamlined Healthcare", desc: "Simplifying eye care with virtual consultations, automated reminders, and efficient service delivery." }
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-5 h-5 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      </div>
                    </div>
                    <p className="ml-4 text-lg text-gray-700 dark:text-gray-300">
                      <span className="font-semibold">{item.title}:</span> {item.desc}
                    </p>
                  </li>
                ))}
              </ul>
            </SectionCard>

            {/* Our Commitment */}
            <SectionCard title="Our Commitment">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                {[
                  { title: "Excellence", desc: "Delivering a top-quality platform meeting high standards of healthcare and technology." },
                  { title: "Inclusion", desc: "Ensuring our services are accessible and beneficial to a wide range of users." },
                  { title: "Growth", desc: "Pushing innovation through continuous research and development." }
                ].map((item, idx) => (
                  <div key={idx} className="bg-blue-50 dark:bg-gray-700 p-6 rounded-lg">
                    <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">{item.title}</h3>
                    <p className="text-gray-700 dark:text-gray-300">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </SectionCard>

            {/* Closing */}
            <div className="bg-blue-600 dark:bg-blue-800 p-8 rounded-2xl shadow-lg text-center">
              <p className="text-xl text-white leading-relaxed">
                By choosing ChasmaPasal, you're embracing a transformative, future-focused approach to eye care that places your well-being and satisfaction at the forefront.
              </p>
            </div>

          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-8 sticky top-6 h-fit">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md overflow-hidden">
              <img 
                src="/images/aboutus.jpeg" 
                alt="About Us" 
                className="w-full h-auto object-cover rounded-xl transform hover:scale-105 transition-transform duration-500 ease-in-out"
              />
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md">
              <h3 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">Quick Facts</h3>
              <ul className="space-y-4">
                {[
                  "Founded in 2023",
                  "1000+ satisfied users",
                  "50+ partner clinics",
                  "Innovation award winner"
                ].map((fact, idx) => (
                  <li key={idx} className="flex items-start">
                    <span className="text-blue-600 dark:text-blue-400 mr-3 text-lg">•</span>
                    <span className="text-gray-700 dark:text-gray-300">{fact}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

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

export default AboutUs;
