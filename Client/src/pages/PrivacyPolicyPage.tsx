// src/pages/PrivacyPolicy.tsx
import React from 'react'

const PrivacyPolicy: React.FC = () => {
  const privacyContent = [
    {
      id: 1,
      title: 'Information We Collect',
      points: [
        'Name, email address, shipping details, and payment information.',
        'Data collected through cookies, analytics tools, and your interactions with our virtual try-on tool.',
      ],
    },
    {
      id: 2,
      title: 'How We Use Your Information',
      points: [
        'To process your orders and payments.',
        'To improve our services and respond to customer service requests.',
      ],
    },
    {
      id: 3,
      title: 'Data Protection',
      points: ['Your data is stored securely and access is restricted.'],
    },
    {
      id: 4,
      title: 'Third-Party Services',
      points: [
        'We may share your data with trusted partners for order fulfillment or analytics, under strict confidentiality.',
      ],
    },
    {
      id: 5,
      title: 'User Rights',
      points: ['You have the right to access, modify, or delete your data by contacting us.'],
    },
    {
      id: 6,
      title: 'Cookies',
      points: [
        'We use cookies to enhance functionality. You may disable them through your browser settings.',
      ],
    },
  ]

  return (
    // Overall Page Container
    <div className={`min-h-screen bg-background py-16 md:py-24 font-sans`}>
      {/* Content Area Container */}
      <div
        className={`
          max-w-4xl mx-auto bg-card rounded-lg shadow-xl 
          p-8 md:p-12 lg:p-16
          text-card-foreground 
        `}
      >
        {/* Main Title */}
        <h1
          className={`
            text-3xl md:text-4xl lg:text-5xl font-bold
            text-card-foreground
            mb-10 md:mb-14 text-center md:text-left
          `}
        >
          Privacy Policy
        </h1>

        {/* Introductory Paragraph */}
        <div className="mb-8 md:mb-10">
          <p className={`text-base md:text-lg leading-relaxed`}>
            At WearFlare, we value your privacy and are committed to protecting your personal data.
            This policy explains how we collect, use, and protect your information.
          </p>
        </div>

        {/* Dynamically generated sections from privacyContent */}
        {privacyContent.map((section) => (
          <section key={section.id} className="mb-8 md:mb-10">
            <h2
              className={`
                text-xl md:text-2xl font-semibold
                text-card-foreground
                mb-4
                pb-2
                border-b border-border/50 
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

        {/* Optional: Contact Information (Can be added as a new section in privacyContent if needed) */}
        {/* For example:
        <section className="mb-8 md:mb-10">
          <h2 className={`text-xl md:text-2xl font-semibold text-card-foreground mb-4 pb-2 border-b border-border/50`}>
            Contact Us
          </h2>
          <p className={`text-base leading-relaxed`}>
            If you have any questions about this Privacy Policy, please contact us at [Your Contact Email Address].
          </p>
        </section>
        */}

        {/* Last Updated Date */}
        <div className="mt-12 md:mt-16 pt-6 border-t border-border/30">
          <p className={`text-sm text-muted-foreground text-center`}>
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

export default PrivacyPolicy
