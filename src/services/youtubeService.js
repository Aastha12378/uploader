const { google } = require('googleapis');
const fs = require('fs')
const axios = require('axios')
const https = require('https');
const path = require('path');
const { User, Schedule } = require('../models');
const OAuth2 = google.auth.OAuth2;

const oauth2Client = new OAuth2(
  process.env.YOUTUBE_CLIENT_ID,
  process.env.YOUTUBE_CLIENT_SECRET,
  process.env.YOUTUBE_REDIRECT_URI
);

async function uploadVideo(videoDetail, scheduleDetail) {
  console.log('uploadVideo  videoDetail.videoUrl:', videoDetail.videoUrl)

  const res = await axios.get(videoDetail.videoUrl, { responseType: 'stream', httpsAgent: new https.Agent({ rejectUnauthorized: false }) });

  const filePath = path.join(__dirname, 'tempVideo.mp4'); // Save the video to a temporary file
  const writer = fs.createWriteStream(filePath);
  res.data.pipe(writer);


  const userData = await User.findOne({ userId: videoDetail.userId }).lean().exec();

  const tokens = userData?.tokens
  oauth2Client.setCredentials(tokens);

  const youtube = google.youtube({
    version: 'v3',
    auth: oauth2Client,
  });

  writer.on('finish', async () => {
    youtube.videos.insert({
      part: 'id,snippet,status',
      notifySubscribers: false,
      requestBody: {
        snippet: {
          title: videoDetail.title || 'Test Video Title',
          description: videoDetail.description || 'Test Video Description',
          // tags: ['Node.js', 'API Test', 'Upload'],
          // categoryId: '22',
        },
        status: {
          privacyStatus: 'private',
        },
      },
      media: {
        body: fs.createReadStream(filePath)
      },
    }, async (err, data) => {
      if (err) {
        console.error('Error uploading video:', err);
        return;
      }

      console.log('Uploaded video with ID:', uploadedStatus, data.data.id);
    });
    const uploadedStatus = (await Schedule.findByIdAndUpdate(
      scheduleDetail._id,
      { $set: { isUploaded: true } },
      { new: true }
    )
      .lean()
      .exec());
  })
}

module.exports = { uploadVideo };
