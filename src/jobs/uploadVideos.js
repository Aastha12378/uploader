const { uploadVideo } = require('../services/youtubeService');
const connectDB = require('../db');
const { Schedule, Video } = require('../models');

// This function should be expanded to query your database for scheduled videos
async function checkAndUploadVideos() {
  // Example video details

  await connectDB();
  const schedules = (await Schedule.find({
    scheduleTime: { $lt: new Date().toISOString() },
    isUploaded: false
  })
    .lean()
    .exec())

  const videoIds = schedules.map(schedule => schedule.videoId);
  console.log('checkAndUploadVideos  videoIds:', videoIds)


  if (schedules?.length > 0) {
    for (const scheduleDetail of schedules) {
      const videoDetailsToUpload = await Video.find({ _id: scheduleDetail.videoId }).exec();

      await uploadVideo(videoDetailsToUpload, scheduleDetail);
    }


    // // Assuming Video model is defined and imported
    // const videoDetailsToUpload = await Video.find({ _id: { $in: videoIds } }).exec();

    // for (const videoDetail of videoDetailsToUpload) {
    //   await uploadVideo(videoDetail);
    // }
  }
}

module.exports = { checkAndUploadVideos };
