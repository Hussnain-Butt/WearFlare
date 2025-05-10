// src/pages/PrivacyPolicy.tsx
import React from 'react'

const PrivacyPolicy: React.FC = () => {
  return (
    // Overall Page Container
    <div className={`min-h-screen bg-background py-16 md:py-24 font-sans`}>
      {/* Content Area Container */}
      <div
        className={`
          max-w-4xl mx-auto bg-card rounded-lg shadow-lg
          p-8 md:p-12 lg:p-16
          text-card-foreground // Default text color for the content area
        `}
      >
        {/* Main Title */}
        <h1
          className={`
            text-3xl md:text-4xl lg:text-5xl font-bold
            text-card-foreground {/* CORRECTED: Ensure only this class is active for text color */}
            mb-10 md:mb-14
          `}
        >
          Privacy Policy
        </h1>

        {/* Introductory Section */}
        <div className="mb-8 md:mb-10">
          <p className={`text-base leading-relaxed`}>
            This Privacy Policy describes how your personal information is collected, used, and
            shared when you visit or make a purchase from WearFlare (the "Site").
          </p>
        </div>

        {/* Personal Information We Collect Section */}
        <section className="mb-8 md:mb-10">
          <h2
            className={`
              text-xl md:text-2xl font-semibold
              text-card-foreground
              mb-4
              pb-2
              border-b border-border/50
            `}
          >
            Personal Information We Collect
          </h2>
          <p className={`text-base leading-relaxed mb-4`}>
            When you visit the Site, we automatically collect certain information about your device,
            including information about your web browser, IP address, time zone, and some of the
            cookies that are installed on your device. Additionally, as you browse the Site, we
            collect information about the individual web pages or products that you view, what
            websites or search terms referred you to the Site, and information about how you
            interact with the Site. We refer to this automatically-collected information as "Device
            Information."
          </p>
          <p className={`text-base leading-relaxed mb-4`}>
            We collect Device Information using the following technologies:
          </p>
          <ul className="list-disc list-outside ml-6 space-y-2 text-base leading-relaxed">
            <li>
              <strong className="font-medium">"Cookies"</strong> are data files that are placed on
              your device or computer and often include an anonymous unique identifier. For more
              information about cookies, and how to disable cookies, visit
              http://www.allaboutcookies.org.
            </li>
            <li>
              <strong className="font-medium">"Log files"</strong> track actions occurring on the
              Site, and collect data including your IP address, browser type, Internet service
              provider, referring/exit pages, and date/time stamps.
            </li>
            <li>
              <strong className="font-medium">"Web beacons," "tags,"</strong> and{' '}
              <strong className="font-medium">"pixels"</strong> are electronic files used to record
              information about how you browse the Site.
            </li>
          </ul>
        </section>

        {/* How Do We Use Your Personal Information Section */}
        <section className="mb-8 md:mb-10">
          <h2
            className={`
              text-xl md:text-2xl font-semibold
              text-card-foreground
              mb-4
              pb-2
              border-b border-border/50
            `}
          >
            How Do We Use Your Personal Information?
          </h2>
          <p className={`text-base leading-relaxed mb-4`}>
            We use the Order Information that we collect generally to fulfill any orders placed
            through the Site (including processing your payment information, arranging for shipping,
            and providing you with invoices and/or order confirmations). Additionally, we use this
            Order Information to:
          </p>
          <ul className="list-disc list-outside ml-6 space-y-2 text-base leading-relaxed">
            <li>Communicate with you;</li>
            <li>Screen our orders for potential risk or fraud; and</li>
            <li>
              When in line with the preferences you have shared with us, provide you with
              information or advertising relating to our products or services.
            </li>
          </ul>
          <p className={`text-base leading-relaxed mt-4`}>
            We use the Device Information that we collect to help us screen for potential risk and
            fraud (in particular, your IP address), and more generally to improve and optimize our
            Site (for example, by generating analytics about how our customers browse and interact
            with the Site, and to assess the success of our marketing and advertising campaigns).
          </p>
        </section>

        {/* Sharing Your Personal Information Section */}
        <section className="mb-8 md:mb-10">
          <h2
            className={`
              text-xl md:text-2xl font-semibold
              text-card-foreground
              mb-4
              pb-2
              border-b border-border/50
            `}
          >
            Sharing Your Personal Information
          </h2>
          <p className={`text-base leading-relaxed mb-4`}>
            We share your Personal Information with third parties to help us use your Personal
            Information, as described above. For example, we use Shopify to power our online
            store--you can read more about how Shopify uses your Personal Information here: [Link to
            Shopify Privacy Policy]. We also use Google Analytics to help us understand how our
            customers use the Site--you can read more about how Google uses your Personal
            Information here: [Link to Google Privacy Policy]. You can also opt-out of Google
            Analytics here: [Link to Google Analytics Opt-out].
          </p>
          <p className={`text-base leading-relaxed`}>
            Finally, we may also share your Personal Information to comply with applicable laws and
            regulations, to respond to a subpoena, search warrant or other lawful request for
            information we receive, or to otherwise protect our rights.
          </p>
        </section>

        {/* Data Retention Section */}
        <section className="mb-8 md:mb-10">
          <h2
            className={`
              text-xl md:text-2xl font-semibold
              text-card-foreground
              mb-4
              pb-2
              border-b border-border/50
            `}
          >
            Data Retention
          </h2>
          <p className={`text-base leading-relaxed`}>
            When you place an order through the Site, we will maintain your Order Information for
            our records unless and until you ask us to delete this information.
          </p>
        </section>

        {/* Changes Section */}
        <section className="mb-8 md:mb-10">
          <h2
            className={`
              text-xl md:text-2xl font-semibold
              text-card-foreground
              mb-4
              pb-2
              border-b border-border/50
            `}
          >
            Changes
          </h2>
          <p className={`text-base leading-relaxed`}>
            We may update this privacy policy from time to time in order to reflect, for example,
            changes to our practices or for other operational, legal or regulatory reasons.
          </p>
        </section>

        {/* Contact Us Section */}
        <section className="mb-8 md:mb-10">
          <h2
            className={`
              text-xl md:text-2xl font-semibold
              text-card-foreground
              mb-4
              pb-2
              border-b border-border/50
            `}
          >
            Contact Us
          </h2>
          <p className={`text-base leading-relaxed`}>
            For more information about our privacy practices, if you have questions, or if you would
            like to make a complaint, please contact us by e-mail at [Your Contact Email] or by mail
            using the details provided below: <br />
            [Your Company Address]
          </p>
        </section>

        {/* Last Updated Date */}
        <div className="mt-12 md:mt-16 pt-6 border-t border-border/30">
          <p className={`text-sm text-muted-foreground text-center`}>
            Last Updated: May 10, 2024 {/* Replace with actual date */}
          </p>
        </div>
      </div>
    </div>
  )
}

export default PrivacyPolicy
