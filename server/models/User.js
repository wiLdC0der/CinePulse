const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const SavedMovieSchema = new mongoose.Schema({
  movieId: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  posterPath: {
    type: String,
    default: ''
  },
  backdropPath: {
    type: String,
    default: ''
  },
  releaseDate: {
    type: String,
    default: ''
  },
  voteAverage: {
    type: Number,
    default: 0
  },
  overview: {
    type: String,
    default: ''
  },
  genres: [{
    id: Number,
    name: String
  }],
  addedAt: {
    type: Date,
    default: Date.now
  }
}, { _id: false });

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email address']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters']
  },
  favorites: [SavedMovieSchema],
  watchlist: [SavedMovieSchema]
}, {
  timestamps: true
});

// Pre-save hook to hash password if modified
UserSchema.pre('save', async function () {
  if (!this.isModified('password')) {
    return;
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare candidate password with hashed password
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
