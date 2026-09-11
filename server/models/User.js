const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Enough movie data to render a card without another TMDB round trip.
// Deliberately not the full TMDB movie object -- see README "Design Decisions".
const savedMovieSchema = new mongoose.Schema(
  {
    movieId: { type: Number, required: true },
    title: { type: String, required: true },
    posterUrl: { type: String, default: null },
    releaseDate: { type: String, default: '' },
    voteAverage: { type: Number, default: 0 },
    genreIds: { type: [Number], default: [] },
    addedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: 80,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      unique: true,
      match: [/^\S+@\S+\.\S+$/, 'Enter a valid email address'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 8,
      select: false, // never returned by default queries
    },
    favorites: { type: [savedMovieSchema], default: [] },
    watchlist: { type: [savedMovieSchema], default: [] },
  },
  { timestamps: true }
);

// Index kept explicit (in addition to `unique: true` above) so the
// intent -- fast + enforced-unique lookups by email -- is documented.
userSchema.index({ email: 1 }, { unique: true });

userSchema.pre('save', async function hashPassword(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = function comparePassword(candidate) {
  return bcrypt.compare(candidate, this.password);
};

userSchema.methods.toSafeObject = function toSafeObject() {
  return {
    id: this._id,
    name: this.name,
    email: this.email,
    createdAt: this.createdAt,
  };
};

module.exports = mongoose.model('User', userSchema);
