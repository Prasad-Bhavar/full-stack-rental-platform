const mongoose = require("mongoose");
const initData = require("./data.js");
const dbURL =
  "mongodb+srv://prasadbhavar04:dHwlhJffqRlybl1V@cluster0.loquoko.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const Listing = require("../models/listing.js");

async function main() {
  await mongoose.connect(dbURL);
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
// console.log(initData);
initDB();
console.log("data is initilized");
