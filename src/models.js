const mongoose = require('mongoose');


const scheduleSchema = new mongoose.Schema({
  videoId: String,
  userId: String,
  scheduleTime: String,
  platform: Number,
  isUploaded: Boolean
});

const Schedule = mongoose.models.Schedule || mongoose.model("Schedule", scheduleSchema);


const videoSchema = new mongoose.Schema({
  scriptType: Number,
  script: String,
  keywords: [String],
  category: String,
  prompt: String,
  videoURL: String,
  voiceURL: String,
  absolutePath: String,
  title: String,
  suggestedVideos: [],
  userId: String,
});
const Video = mongoose.models.Video || mongoose.model("Video", videoSchema);

const schema = new mongoose.Schema({
  userId: String,
  tokens: Object,
});
const User = mongoose.models.User || mongoose.model("User", schema);


module.exports = { User, Video, Schedule };