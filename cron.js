var cron = require('node-cron');
const helper = require("./helper");

cron.schedule('0 0 3 * * *', () => {
  console.log('running the cron job every 24 hours at 3 AM');
  helper.deleteFiles();
});