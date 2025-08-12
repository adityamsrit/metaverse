const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true // Remove whitespace from both ends of a string
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true, // Store emails in lowercase
    match: [/.+@.+\..+/, 'Please enter a valid email address'] // Basic email format validation
  },
  password: {
    type: String,
    required: true,
    minlength: 6 // Minimum password length
  },
  avatarSettings: { // Placeholder for avatar customization options
    color: { type: String, default: '#00ff00' }, // Default avatar color (e.g., green)
    model: { type: String, default: 'cube' } // Default avatar model (e.g., a simple cube)
    // Add more avatar customization options here as needed
  },
  createdAt: {
    type: Date,
    default: Date.now // Automatically set the creation date
  }
});

module.exports = mongoose.model('User', UserSchema);