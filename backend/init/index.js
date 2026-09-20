const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/tripnest";

main()
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
  await Listing.deleteMany({});
  initData.data = initData.data.map((obj) => ({
    ...obj,
    // geometry: { type: "Point", coordinates: [75.7872709, 26.9124336] },
    owner: "enter id",
  }));
  //replace the object id with any userid
  await Listing.insertMany(initData.data);
  console.log("Data was initialized");
};
await User.updateMany(
  { avatar: { $exists: false } },
  { $set: { avatar: { url: "", filename: "" } } }
);
initDB();
