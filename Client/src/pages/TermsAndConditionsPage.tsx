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
  return (
    // Overall Page Container
    <div className={`min-h-screen bg-[${palette.lightGreyBeige}] py-16 md:py-24 font-sans`}>
      {/* Content Area Container */}
      <div
        className={`
          max-w-4xl mx-auto bg-[${palette.white}] rounded-lg shadow-lg
          p-8 md:p-12 lg:p-16
          text-[${palette.darkBrown}] // Default text color for the content area
        `}
      >
        {/* Main Title */}
        <h1
          className={`
            text-3xl md:text-4xl lg:text-5xl font-bold
            text-[${palette.darkBrown}]
            mb-10 md:mb-14 // Increased bottom margin
          `}
        >
          Terms & Conditions
        </h1>

        {/* Introductory Section */}
        <div className="mb-8 md:mb-10">
          {' '}
          {/* Added margin below intro */}
          <p className={`text-base leading-relaxed mb-4`}>
            Welcome to [Your Website Name]! These terms and conditions outline the rules and
            regulations for the use of [Your Company Name]'s Website, located at [Your Website URL].
          </p>
          <p className={`text-base leading-relaxed`}>
            By accessing this website we assume you accept these terms and conditions. Do not
            continue to use [Your Website Name] if you do not agree to take all of the terms and
            conditions stated on this page.
          </p>
        </div>

        {/* Cookies Section */}
        <section className="mb-8 md:mb-10">
          <h2
            className={`
              text-xl md:text-2xl font-semibold
              text-[${palette.darkBrown}]
              mb-4 // Margin below heading
              pb-2 // Padding below heading
              border-b border-[${palette.mutedGreenGrey}]/50 // Subtle bottom border for heading
            `}
          >
            Cookies
          </h2>
          <p className={`text-base leading-relaxed`}>
            We employ the use of cookies. By accessing [Your Website Name], you agreed to use
            cookies in agreement with the [Your Company Name]'s Privacy Policy. Most interactive
            websites use cookies to let us retrieve the user's details for each visit...{' '}
            {/* Truncated for brevity */}
          </p>
        </section>

        {/* License Section */}
        <section className="mb-8 md:mb-10">
          <h2
            className={`
              text-xl md:text-2xl font-semibold
              text-[${palette.darkBrown}]
              mb-4
              pb-2
              border-b border-[${palette.mutedGreenGrey}]/50
            `}
          >
            License
          </h2>
          <p className={`text-base leading-relaxed`}>
            Unless otherwise stated, [Your Company Name] and/or its licensors own the intellectual
            property rights for all material on [Your Website Name]. All intellectual property
            rights are reserved. You may access this from [Your Website Name] for your own personal
            use subjected to restrictions set in these terms and conditions.
          </p>
          {/* Add more paragraphs or list items for license details if needed */}
        </section>

        {/* Add More Sections as needed following the same pattern */}
        {/* Example: Hyperlinking */}
        <section className="mb-8 md:mb-10">
          <h2
            className={`
              text-xl md:text-2xl font-semibold
              text-[${palette.darkBrown}]
              mb-4
              pb-2
              border-b border-[${palette.mutedGreenGrey}]/50
            `}
          >
            Hyperlinking to our Content
          </h2>
          <p className={`text-base leading-relaxed mb-4`}>
            The following organizations may link to our Website without prior written approval:
          </p>
          {/* Use ul/li for lists */}
          <ul className="list-disc list-outside ml-6 space-y-2 text-base leading-relaxed">
            <li>Government agencies;</li>
            <li>Search engines;</li>
            <li>News organizations;</li>
            <li>
              Online directory distributors may link to our Website in the same manner as they
              hyperlink to the Websites of other listed businesses; and
            </li>
            <li>
              System wide Accredited Businesses except soliciting non-profit organizations, charity
              shopping malls, and charity fundraising groups which may not hyperlink to our Web
              site.
            </li>
          </ul>
          {/* Add more content */}
        </section>

        {/* Optional: Last Updated Date */}
        <div className="mt-12 md:mt-16 pt-6 border-t border-[${palette.mutedGreenGrey}]/30">
          <p className={`text-sm text-[${palette.mediumBrown}] text-center`}>
            Last Updated: October 26, 2023 {/* Replace with actual date */}
          </p>
        </div>
      </div>{' '}
      {/* End Content Area Container */}
    </div> // End Overall Page Container
  )
}

export default TermsAndConditions
