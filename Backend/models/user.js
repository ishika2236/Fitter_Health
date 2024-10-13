const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    age: { type: Number, required: true },
    gender: { type: String, enum: ['Male', 'Female', 'Other'] },
    profilePicture: { type: String },
    height: { type: Number, required: true },
    weight: { type: Number, required: true },
    fitnessGoals: { type: String }, 
    workoutLevel: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Beginner' },
    joinedAt: { type: Date, default: Date.now },
    lastLogin: { type: Date },
    role: { type: String, enum: ['User', 'Admin'], default: 'User' },
    isVerified: { type: Boolean, default: false },
  
    // References to other collections
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
    friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    workoutHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Workout' }]
});

const User = mongoose.model('User', UserSchema);
module.exports = User;

  