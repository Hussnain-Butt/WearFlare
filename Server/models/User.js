// models/User.js
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Full name is required.'],
    },
    email: {
      type: String,
      required: [true, 'Email is required.'],
      unique: true,
      lowercase: true,
      // Basic email validation
      match: [/.+\@.+\..+/, 'Please provide a valid email address.'],
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required.'],
      minlength: [6, 'Password must be at least 6 characters long.'],
      select: false, // Hide password by default when querying users
    },
    // --- *** ADD THESE FIELDS FOR PASSWORD RESET *** ---
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    // --- *** END ADDED FIELDS *** ---
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
  },
)

// --- Middleware to Hash Password Before Saving ---
userSchema.pre('save', async function (next) {
  // Only run this function if password was actually modified
  if (!this.isModified('password')) return next()

  // Hash the password with cost of 12
  try {
    const salt = await bcrypt.genSalt(10) // Generate salt
    this.password = await bcrypt.hash(this.password, salt) // Hash password

    // If resetting password, don't clear confirm field here
    // Delete passwordConfirm field if you have one (not needed in DB)
    // this.passwordConfirm = undefined;

    next()
  } catch (error) {
    next(error) // Pass error to next middleware/error handler
  }
})

// --- Instance Method to Compare Passwords (Optional but good practice) ---
// Note: Your current login uses bcrypt.compare directly, which is also fine.
// userSchema.methods.comparePassword = async function (candidatePassword) {
//   // 'this.password' refers to the hashed password in the document
//   // Need to ensure password field was selected during query if using this method
//   return await bcrypt.compare(candidatePassword, this.password);
// };

const User = mongoose.model('User', userSchema)

module.exports = User
