const mongoose = require("mongoose");

const connectDB = async () => {
  const Url =
    process.env.NODE_ENV === "development"
      ? process.env.DEV_DB_URL
      : process.env.PROD_DB_URL;
  const conn = await mongoose.connect(Url);
  console.log(
    `mongodb Connected at ${conn.connection.host} ${conn.connection.port}`.cyan
      .underline
  );
};
module.exports = connectDB;
