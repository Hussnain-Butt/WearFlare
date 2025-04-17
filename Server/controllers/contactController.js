// controllers/contactController.js
const sendEmail = require('../utils/sendEmail') // Import your email utility

exports.handleContactForm = async (req, res) => {
  try {
    const { firstName, lastName, email, message } = req.body

    // --- Basic Server-Side Validation ---
    if (!firstName || !lastName || !email || !message) {
      return res.status(400).json({ message: 'Please fill in all required fields.' })
    }
    // Optional: Add more validation (e.g., email format)
    if (!/.+\@.+\..+/.test(email)) {
      return res.status(400).json({ message: 'Please provide a valid email address.' })
    }
    // --- End Validation ---

    // --- Option 1: Log to Console (Simplest) ---
    console.log('--- New Contact Form Submission ---')
    console.log(`Name: ${firstName} ${lastName}`)
    console.log(`Email: ${email}`)
    console.log(`Message: ${message}`)
    console.log('----------------------------------')

    // --- Option 2: Send Email Notification to Admin ---
    // Make sure ADMIN_EMAIL is defined in your .env file
    const adminEmail = 'bhussnain966@gmail.com'
    if (!adminEmail) {
      console.error('ADMIN_EMAIL is not set in environment variables. Cannot send notification.')
      // Decide if this should be an error response or just log internally
      // return res.status(500).json({ message: 'Server configuration error.' });
    } else {
      try {
        const emailSubject = `New Contact Form Submission from ${firstName} ${lastName}`
        const emailMessage = `
                You received a new message from your website contact form:\n
                Name: ${firstName} ${lastName}\n
                Email: ${email}\n
                Message:\n
                ${message}
            `
        await sendEmail({
          email: adminEmail, // Send TO the admin
          subject: emailSubject,
          message: emailMessage,
          // Optional: Set a 'replyTo' field
          // replyTo: email
        })
        console.log(`Contact form notification sent to ${adminEmail}`)
      } catch (emailError) {
        console.error('Failed to send contact form notification email:', emailError)
        // Log the error but don't necessarily stop the success response to the user
      }
    }
    // --- End Option 2 ---

    // --- Option 3: Save to Database (Recommended for storing messages) ---
    // If you create a ContactMessage model:
    // const ContactMessage = require('../models/ContactMessage'); // Create this model
    // const newMessage = new ContactMessage({ firstName, lastName, email, message });
    // await newMessage.save();
    // console.log('Contact message saved to database.');
    // --- End Option 3 ---

    // Send success response to the frontend
    res.status(200).json({ message: 'Message received successfully!' })
  } catch (error) {
    console.error('Error handling contact form:', error)
    res
      .status(500)
      .json({ message: 'Server error processing your message. Please try again later.' })
  }
}
