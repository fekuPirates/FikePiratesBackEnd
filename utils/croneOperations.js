const axios = require("axios");
const News = require("../models/News");
const fetchNewsFronNyt = async () => {
  const url = `https://api.nytimes.com/svc/topstories/v2/world.json?api-key=${process.env.NTY_KEY}`;

  try {
    let result = await axios.get(url);

    if (result.data.status === "ok" && result.data.result.length > 0) {
      result = result.result;

      result.map((data, index) => {
        let newNews = new News({
          title,
          imgUrl,
          more_url,
          abstract,
        });
      });
    }
  } catch (error) {
    console.log("somehting went wrong");
  }
};

module.exports = fetchNewsFronNyt;
