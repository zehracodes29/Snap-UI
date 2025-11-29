// models/Project.js
const mongoose = require("mongoose");

const ProjectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    default: "Untitled Project",
  },
  generatedCode: {
    type: String,
    default: "", // will store the AI-generated React/Tailwind code
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // optional, if you have authentication
    required: false,
  },
  status: {
    type: String,
    enum: ["new", "in-progress", "completed"],
    default: "new",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update the updatedAt field on each save
ProjectSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("Project", ProjectSchema);
