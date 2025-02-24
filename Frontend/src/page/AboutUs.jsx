const AboutUs = () => {
  return (
    <div className="min-h-screen w-screen mx-auto px-4 py-8">
      <div className="grid grid-cols-3 gap-8">
        <div className="col-span-2">
          <h1 className="text-3xl font-bold mb-4">About ChasmaPasal</h1>
          <p className="mb-8 text-justify">
            ChasmaPasal is a state-of-the-art healthcare platform that merges the latest advancements in augmented reality (AR) with eye care services. Our solution transforms traditional eye care by offering a smooth and innovative experience for both patients and healthcare providers.
          </p>

          <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
          <p className="mb-8 text-justify">
            At ChasmaPasal, our goal is to bridge the gap between traditional eye care practices and modern technological innovations. We are dedicated to providing accessible, efficient, and customized eye care solutions by incorporating augmented reality, ensuring a high level of satisfaction and well-being for our users.
          </p>

          <h2 className="text-2xl font-bold mb-4">About Us</h2>
          <p className="mb-8 text-justify">
            We are a passionate team of experts focused on reshaping the eye care industry. ChasmaPasal brings together professionals from healthcare, technology, and design to create a platform that not only upholds the highest standards of quality but is also adaptable to the evolving needs of the healthcare sector.
          </p>

          <h2 className="text-2xl font-bold mb-4">Why Choose ChasmaPasal</h2>
          <ul className="list-disc pl-6 mb-8 text-justify">
            <li>Advanced Technology: ChasmaPasal utilizes augmented reality to provide an engaging and interactive experience, particularly in the process of trying on eyeglasses virtually.</li>
            <li>Focus on Patients: Our platform is built with the user in mind. From easy appointment scheduling to personalized virtual frame try-ons, ChasmaPasal emphasizes comfort and satisfaction for all users.</li>
            <li>Streamlined Healthcare: ChasmaPasal simplifies the eye care process, making it more efficient for both patients and healthcare professionals. Features such as automated reminders and virtual consultations improve healthcare delivery.</li>
          </ul>

          <h2 className="text-2xl font-bold mb-4">Our Commitment</h2>
          <ul className="list-disc pl-6 mb-8 text-justify">
            <li>Excellence: We aim to deliver a top-quality platform that meets the highest standards of both healthcare and technology.</li>
            <li>Inclusion: Our goal is to ensure that our innovative eye care services are available to a wide range of users, promoting accessibility in healthcare.</li>
            <li>Ongoing Growth: We are committed to continuous improvement through research, development, and feedback, ensuring that ChasmaPasal evolves to meet the ever-changing needs of our users.</li>
          </ul>

          <p className="mb-4 text-justify">
            By choosing ChasmaPasal, you are not just opting for a healthcare platform, but embracing a transformative, future-focused approach to eye care that places your well-being and satisfaction at the forefront.
          </p>
        </div>
        <div className="col-span-1 relative">
          <img 
            src="/images/aboutus.jpeg" 
            alt="About Us" 
            className="w-full h-auto object-cover rounded-lg shadow-lg" 
          />
        </div>
      </div>
    </div>
  );
}

export default AboutUs;
