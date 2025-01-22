const mongoose = require('mongoose');
const { Schema } = mongoose;

// Load environment variables (e.g., using dotenv)
// require('dotenv').config();

main()
  .then(() => console.log("DB connected successfully"))
  .catch(err => console.error("Database connection failed:", err));

async function main() {
  const url = process.env.MONGO_URI || 'mongodb+srv://shaikrasheed6341:BMplP9eCpkoTcwyC@cluster0.kkdnb.mongodb.net/';
  await mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
}

const userSchema = new Schema({
  fristname: {
    type: String,
    required: [true, "First name is required"],
    trim: true,
    maxlength: [30, "First name cannot exceed 30 characters"],
    minlength: [3, "First name must be at least 3 characters"],
  },
  lastname: {
    type: String,
    required: [true, "Last name is required"],
    trim: true,
    maxlength: [30, "Last name cannot exceed 30 characters"],
    minlength: [3, "Last name must be at least 3 characters"],
  },
  username: {
    type: String,
    required: [true, "Username is required"],
    unique: true,
    maxlength: [50, "Username cannot exceed 50 characters"],
    minlength: [3, "Username must be at least 3 characters"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [6, "Password must be at least 6 characters"],
  },
});

const User = mongoose.model("User", userSchema);

module.exports = { User };
