const Listing = require("../models/listing");

module.exports.index = async (req, res) => {
  try {
    const searchQuery = req.query.search;

    console.log(searchQuery);
    let allLists = await Listing.find();
    
    let filteredListings = allLists.filter(list =>
      list.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  if(searchQuery != " "){
    allLists = filteredListings;
  }
  
    
    res.render("./listing/index.ejs", { allLists });
  } catch (err) {
    next(err);
  }
};

module.exports.renderNewForm = (req, res) => {
  res.render("./listing/new.ejs");
};

module.exports.showListings = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner"); //populate is use to expand the review Objects id;
  if (!listing) {
    req.flash("error", "lisiting you want to search doesnt exist");
    res.redirect("/listing");
  }
  // console.log(listing);
  res.render("./listing/show.ejs", { listing });
};

module.exports.createListing = async (req, res) => {
  // console.log(listingSchema);
  let url = req.file.path;
  let filename = req.file.filename;
  let newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = { url, filename };
  await newListing.save();
  req.flash("success", "New listing Added");
  res.redirect("/listing");
};

module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "lisiting you want to search doesnt exxist");
    res.redirect("/listing");
  }
  let orignalImgUrl = listing.image.url;
  orignalImgUrl = orignalImgUrl.replace("/upload", "/upload/h_300,w_250");

  res.render("./listing/edit.ejs", { listing, orignalImgUrl });
  // console.log(listing.image.url);
};

module.exports.updateListing = async (req, res) => {
  const { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
  }

  req.flash("success", "listing updated");
  res.redirect(`/listing/${id}`);
};

module.exports.destroyListing = async (req, res) => {
  const { id } = req.params;
  let deleted = await Listing.findByIdAndDelete(id);
  req.flash("success", "listing deleted");
  res.redirect("/listing");
  console.log(deleted);
};
