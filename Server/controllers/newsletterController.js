// controllers/newsletterController.js
const Subscriber = require('../models/Subscriber')
const sendEmail = require('../utils/sendEmail') // Import if sending welcome email

exports.subscribeNewsletter = async (req, res) => {
  try {
    const { email } = req.body

    if (!email) {
      return res.status(400).json({ message: 'Email address is required.' })
    }

    // Server-side validation (redundant if using validator in model, but good practice)
    if (!/.+\@.+\..+/.test(email)) {
      return res.status(400).json({ message: 'Please provide a valid email address.' })
    }

    // Check if email already exists (case-insensitive check)
    const existingSubscriber = await Subscriber.findOne({ email: email.toLowerCase() })
    if (existingSubscriber) {
      // Decide how to handle existing subscribers - maybe just return success silently
      // or return a specific message. Returning success often prevents bots from probing.
      console.log(`Email already subscribed: ${email}`)
      return res.status(200).json({ message: 'You are already subscribed!' }) // Or a more generic success
    }

    // Create and save the new subscriber
    const newSubscriber = new Subscriber({ email })
    await newSubscriber.save()

    console.log(`New newsletter subscription: ${email}`)

    // --- Optional: Send Welcome Email ---
    // try {
    //     await sendEmail({
    //         email: newSubscriber.email,
    //         subject: 'Welcome to the WearFlare Newsletter!',
    //         message: 'Thanks for subscribing! You\'ll be the first to know about new arrivals, exclusive previews, and sales.'
    //     });
    //     console.log(`Welcome email sent to ${newSubscriber.email}`);
    // } catch (emailError) {
    //     console.error(`Failed to send welcome email to ${newSubscriber.email}:`, emailError);
    //     // Log error but don't fail the subscription process
    // }
    // --- End Optional Welcome Email ---

    res.status(201).json({ message: 'Subscription successful! Welcome aboard.' })
  } catch (error) {
    console.error('Error subscribing to newsletter:', error)
    // Handle Mongoose validation errors specifically
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((el) => el.message)
      return res.status(400).json({ message: messages.join('. ') })
    }
    // Handle duplicate key error (just in case findOne check misses due to race condition)
    if (error.code === 11000) {
      return res.status(200).json({ message: 'You are already subscribed!' })
    }
    res.status(500).json({ message: 'Subscription failed. Please try again later.' })
  }
}
