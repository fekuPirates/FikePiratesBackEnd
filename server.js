const app = require("./app");
//Port
const PORT = process.env.PORT || 3000;
// const redis = require("redis");
// const redisUrl = "redis://127.0.0.1:6379";
const server = app.listen(PORT, () => {
  console.log(
    ` app listening at http://localhost:${PORT} in ${process.env.NODE_ENV} mode`
      .yellow.bold
  );
});

module.exports = server;
