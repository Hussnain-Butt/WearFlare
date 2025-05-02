const nodemailer = require('nodemailer')

const sendEmail = async (options) => {
  // 1) Create a transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    // Note: For services like Gmail, you might need secure: false, requireTLS: true depending on port
  })

  // 2) Define the email options
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: options.email,
    subject: options.subject,
    text: options.message, // Plain text version
    html: options.html, // You can add an HTML version too
  }

  // 3) Actually send the email
  try {
    await transporter.sendMail(mailOptions)
    console.log('Email sent successfully')
  } catch (error) {
    console.error('Error sending email:', error)
    // Consider how to handle email sending errors (e.g., log them, retry later)
    // Throwing an error here might be appropriate if the calling function needs to know
    throw new Error('There was an error sending the email. Try again later.')
  }
}

module.exports = sendEmail
