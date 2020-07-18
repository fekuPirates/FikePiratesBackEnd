var cron = require("node-cron");

cron.schedule("* * */23 * * *", () => {
  console.log("hellow");
  // fetchNewsFronNyt();
});
// }
