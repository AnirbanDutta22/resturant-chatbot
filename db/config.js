const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose
    .connect(`${process.env.MONGO_CONNECTION_URI}/${process.env.DB_NAME}`)
    .then(() => {
      console.log("Database connected successfully !");
    })
    .catch((err) => {
      console.log(err);
    });
};
module.exports = connectDB;

// const mongoose = require("mongoose");
// const MongoClient = require("mongodb").MongoClient;

// const connectDB = async () => {
//   await MongoClient.connect(process.env.MONGO_CONNECTION_URI)
//     .then((client) => {
//       const connect = client.db(process.env.DB_NAME);

//       // Dropping the database
//       connect.dropDatabase();
//       console.log("Database dropped successfully !");
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// };
// module.exports = connectDB;
