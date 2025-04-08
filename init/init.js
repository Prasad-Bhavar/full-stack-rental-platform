const mongoose = require("mongoose");
const initData = require("./data.js");
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const Listing = require("../models/listing.js");

async function main() {
  await mongoose.connect(MONGO_URL);
}

main()
  .then((res) => console.log("connection establish with database succesfully"))
  .catch((err) => console.log(err));

const initDB = async () => {
  await Listing.deleteMany({});
  initData.data = initData.data.map((obj) => ({
    ...obj,
    owner: "670bcb16404ddf9597aa0e5f",
  }));
  await Listing.insertMany(initData.data);
};
console.log(initData);
initDB();
console.log("data is initilized");
