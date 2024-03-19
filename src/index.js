const cron = require('node-cron');
const { checkAndUploadVideos } = require('./jobs/uploadVideos');

// Run every hour (adjust as needed)
cron.schedule('* * * * *', () => {
  console.log('Checking for videos to upload...');
  checkAndUploadVideos();
});