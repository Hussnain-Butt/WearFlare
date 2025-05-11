import React from 'react'

// --- Define Color Palette (From your Coolors image) ---
const palette = {
  darkBrown: '#433E3F', // Main text, headings
  mediumBrown: '#8E6E53', // Secondary text/accents
  lightTan: '#C69C72', // Highlight accent (optional)
  lightGreyBeige: '#C0B7B1', // Main page background
  mutedGreenGrey: '#7A7265', // Border/subtle accent
  white: '#FFFFFF', // Content area background
}

const TermsAndConditions: React.FC = () => {
  const termsContent = [
    {
      id: 1,
      title: 'Use of the Website',
      points: [
        'You agree to use the site for lawful purposes only.',
        'You must not misuse the site or attempt to access it using unauthorized methods.',
      ],
    },
    {
      id: 2,
      title: 'Account Registration',
      points: [
        'You are responsible for maintaining the confidentiality of your account information.',
        'You agree to provide accurate and current information during registration.',
      ],
    },
    {
      id: 3,
      title: 'Product Information',
      points: [
        'We strive to display product details and images as accurately as possible.',
        'WearFlare is not liable for minor color variations due to screen differences or lighting.',
      ],
    },
    {
      id: 4,
      title: 'Virtual Try-On',
      points: [
        'Our 3D avatar feature is provided for visualization purposes. Fit and sizing may vary.',
      ],
    },
    {
      id: 5,
      title: 'Intellectual Property',
      points: [
        'All content on WearFlare, including images, logos, and software, is the property of WearFlare and is protected by copyright laws.',
      ],
    },
    {
      id: 6,
      title: 'Limitation of Liability',
      points: [
        'WearFlare is not responsible for any indirect or consequential damages arising from your use of our platform.',
      ],
    },
    {
      id: 7,
      title: 'Changes to Terms',
      points: [
        'We may update these terms at any time. Continued use of the platform indicates acceptance of the new terms.',
      ],
    },
  ]

  return (
    // Overall Page Container
    <div className={`min-h-screen bg-[${palette.lightGreyBeige}] py-16 md:py-24 font-sans`}>
      {/* Content Area Container */}
      <div
        className={`
          max-w-4xl mx-auto bg-[${palette.white}] rounded-lg shadow-xl
          p-8 md:p-12 lg:p-16
          text-[${palette.darkBrown}]
        `}
      >
        {/* Main Title */}
        <h1
          className={`
            text-3xl md:text-4xl lg:text-5xl font-bold
            text-[${palette.darkBrown}]
            mb-10 md:mb-14 text-center md:text-left
          `}
        >
          Terms & Conditions
        </h1>

        {/* Introductory Paragraph */}
        <div className="mb-8 md:mb-10">
          <p className={`text-base md:text-lg leading-relaxed`}>
            Welcome to WearFlare. By accessing or using our website, mobile applications, or any
            services provided by WearFlare ("we", "our", "us"), you agree to comply with and be
            bound by the following terms and conditions:
          </p>
        </div>

        {/* Dynamically generated sections from termsContent */}
        {termsContent.map((section) => (
          <section key={section.id} className="mb-8 md:mb-10">
            <h2
              className={`
                text-xl md:text-2xl font-semibold
                text-[${palette.darkBrown}]
                mb-4
                pb-2
                border-b border-[${palette.mutedGreenGrey}]/50
              `}
            >
              {section.id}. {section.title}
            </h2>
            {section.points.length === 1 ? (
              <p className={`text-base leading-relaxed`}>{section.points[0]}</p>
            ) : (
              <ul className="list-disc list-outside ml-6 space-y-2 text-base leading-relaxed">
                {section.points.map((point, index) => (
                  <li key={index}>{point}</li>
                ))}
              </ul>
            )}
          </section>
        ))}

        {/* Optional: Last Updated Date */}
        <div className="mt-12 md:mt-16 pt-6 border-t border-[${palette.mutedGreenGrey}]/30">
          <p className={`text-sm text-[${palette.mediumBrown}] text-center`}>
            Last Updated:{' '}
            {new Date().toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
      </div>{' '}
      {/* End Content Area Container */}
    </div> // End Overall Page Container
  )
}

export default TermsAndConditions
