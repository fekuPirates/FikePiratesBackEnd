const fetch = require("node-fetch");

//@desc     get viedos of single playLists
//@route   GET /api/v1/youtube/playlist/videos
//@access  public
module.exports.getVideosOfPlayList = async (req, res, next) => {
  try {
    const playListId = req.query.q;
    const _getVideosOfPlayList = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${playListId}&maxResults=50&key=AIzaSyBX5y8z7JeZ7w9lbNGlabsEZ6x4WGB2K-8`;
    const playListVideos = [];
    let playListVideo = {
      videoId: "",
      title: "",
      publishedAt: "",
      thumbNail: [
        {
          medium: "",
        },
        {
          high: "",
        },
      ],
      description: "",
    };

    let response = await fetch(_getVideosOfPlayList);
    response = await response.json();
    if (response && response.items) {
      response = response.items;

      response.map((pl, index) => {
        playListVideo = {
          publishedAt: pl.snippet.publishedAt,
          title: pl.snippet.title,
          description: pl.snippet.description,
          videoId: pl.snippet.resourceId.videoId,
          thumbNail: [
            {
              medium: pl.snippet.thumbnails.medium.url,
            },
            {
              high: pl.snippet.thumbnails.high.url,
            },
          ],
        };

        playListVideos.push(playListVideo);
      });
      res.send({
        success: true,
        code: 200,
        count: response.length,
        result: playListVideos,
      });
    }
  } catch (error) {
    //TODO://  need to handle errors
    res.send(error);
  }
};

//@desc    get ALl PlayList
//@route   GET /api/v1/youtube/playlist/all
//@access  public
module.exports.getAllPlayList = async (req, res, next) => {
  try {
    let _getPlayLists = `https://www.googleapis.com/youtube/v3/playlists?part=snippet%2CcontentDetails&channelId=${process.env.YOUTUBE_CHANNEL_ID}&maxResults=25&key=${process.env.YOUTUBE_API_KEY}`;
    let playList = {
      playListitemId: "",
      title: "",
      thumbNail: [
        {
          medium: "",
        },
        {
          high: "",
        },
      ],
      description: "",
      playListItemNo: "",
    };
    let playLists = [];

    let response = await fetch(_getPlayLists);
    response = await response.json();
    if (response && response.items) {
      response = response.items;
      response.map((pl, index) => {
        playList = {
          playListitemId: pl.id,
          title: pl.snippet.title,
          description: pl.snippet.description,
          thumbNail: [
            { medium: pl.snippet.thumbnails.medium.url },
            {
              high: pl.snippet.thumbnails.standard.url,
            },
          ],
          playListItemNo: pl.contentDetails.itemCount,
        };
        playLists.push(playList);
      });
      res.send({
        success: true,
        code: 200,
        count: playLists.length,
        result: playLists,
      });
    }
  } catch (error) {
    //TODO://  need to handle errors
    res.send(error);
  }
};

//@desc     get channel details
//@route   GET/api/v1/youtube/channel/details
//@access  public
module.exports.getChannelDetails = async (req, res, next) => {
  try {
    let _getChannnelDetails = `https://www.googleapis.com/youtube/v3/channels?part=snippet%2CcontentDetails%2Cstatistics&id=${process.env.YOUTUBE_CHANNEL_ID}&key=${process.env.YOUTUBE_API_KEY}`;
    let response = await fetch(_getChannnelDetails);
    response = await response.json();
    if (response && response.items) {
      let result = {
        channelId: "",
        channelName: "",
        channelDescription: "",
        thumbNail: [
          {
            medium: "",
          },
          {
            high: "",
          },
        ],
        country: "",
        viewCount: "",
        videoCount: "",
        subscriberCount: "",
      };
      response = response.items[0];
      result.channelId = response.id;
      result.channelName = response.snippet.title;
      result.channelDescription = response.snippet.description;
      result.thumbNail[0].medium = response.snippet.thumbnails.medium.url;
      result.thumbNail[1].high = response.snippet.thumbnails.high.url;
      result.country = response.snippet.country;
      result.videoCount = response.statistics.videoCount;
      result.viewCount = response.statistics.viewCount;
      result.subscriberCount = response.statistics.subscriberCount;
      res.send({ success: true, code: 200, result: result });
    }
  } catch (error) {
    //TODO://  need to handle errors
    res.send(error);
  }
};

//@desc    get singleVideoById
//@route   GET /api/v1/youtube/video/:id
//@access  public
module.exports.getSingleVideoById = async (req, res, next) => {
  try {
    const id = req.params.id;
    let _getSingleVideoDetail = `https://www.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&id=${id}&key=${process.env.YOUTUBE_API_KEY}`;
    const video = {
      videoId: "",
      title: "",
      description: "",
      publishedAt: "",
      tags: [],
      viewCount: "",
      likeCount: "",
      dislikeCount: "",
      commentCount: "",
      duration: "",
    };

    let response = await fetch(_getSingleVideoDetail);
    response = await response.json();
    if (response && response.items) {
      response = response.items[0];
      video.videoId = response.id;
      video.publishedAt = response.snippet.publishedAt;
      video.title = response.snippet.title;
      video.description = response.snippet.description;
      video.duration = response.contentDetails.duration;
      video.viewCount = response.statistics.viewCount;
      video.dislikeCount = response.statistics.dislikeCount;
      video.likeCount = response.statistics.likeCount;
      video.commentCount = response.statistics.commentCount;
      video.tags = response.snippet.tags;
      res.send({ success: false, code: 200, result: video });
    }
  } catch (error) {}
};
