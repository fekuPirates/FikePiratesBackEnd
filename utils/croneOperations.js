const axios = require("axios");
const News = require("../models/News");
const fetchNewsFronNyt = async () => {
  const url = `https://api.nytimes.com/svc/topstories/v2/world.json?api-key=${process.env.NYT_KEY}`;
  try {
    let response = await axios.get(url);
    console.log(response.data.status);
    if (response.data.status === "OK") {
      response = response.data.results;
      response.forEach(async (element) => {
        let newNews = new News({
          title: element.title,
          abstract: element.abstract,
          subsection: element.subsection,
          byLine: element.byline,
          createdAt: element.created_date,
          updatedAt: element.updated_date,
          publishedAt: element.published_date,
          imgUrl: element.multimedia[0].url,
          more_url: element.short_url,
        });
        await newNews.save();
        console.log("saved");
      });
    } else {
      console.log("no");
    }
  } catch (error) {
    console.log(error);
    console.log("somehting went wrong");
  }
};

module.exports = fetchNewsFronNyt;
