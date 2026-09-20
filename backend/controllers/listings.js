const Listing = require("../models/listing");
const { Client } = require("@googlemaps/google-maps-services-js");
const cloudinary = require("cloudinary").v2;

// Initialize Google Maps Client
const client = new Client({});

/**
 * Display all listings with optional search and category filtering.
 */
module.exports.index = async (req, res) => {
  const { search, category } = req.query;
  let query = {};

  // Search filter: location, country, title, or description
  if (search) {
    query.$or = [
      { location: { $regex: search, $options: "i" } },
      { country: { $regex: search, $options: "i" } },
      { title: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }

  // Category filter (if not "all")
  if (category && category !== "all") {
    query.category = category;
  }

  const allListings = await Listing.find(query);
  res.render("listings/index.ejs", {
    allListings,
    category: category || "all",
    search: search || "",
  });
};

/**
 * Render the form to create a new listing.
 */
module.exports.renderNewForm = (req, res) => {
  res.render("listings/new");
};

/**
 * Show details for a specific listing.
 */
module.exports.showListing = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: { path: "author" },
    })
    .populate("owner");

  if (!listing) {
    req.flash("error", "Listing you requested for does not exist!");
    return res.redirect("/listings");
  }

  res.render("listings/show", { listing });
};

/**
 * Create a new listing with geolocation and image uploads.
 */
module.exports.createListing = async (req, res, next) => {
  const { location } = req.body.listing;

  // Step 1: Geocode the location using Google Maps API
  let geoData;
  try {
    const response = await client.geocode({
      params: {
        address: location,
        key: process.env.MAP_TOKEN,
      },
    });
    const { lat, lng } = response.data.results[0].geometry.location;
    geoData = {
      type: "Point",
      coordinates: [lng, lat], // GeoJSON format
    };
  } catch (err) {
    req.flash("error", "Could not find location.");
    return res.redirect("/listings/new");
  }

  // Require at least one image to be uploaded
  if (!req.files || req.files.length === 0) {
    req.flash("error", "At least one image is required!");
    return res.redirect("/listings/new");
  }

  // Create and save the listing
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;

  // Save image info (Cloudinary)
  newListing.images = req.files.map((f) => ({
    url: f.path,
    filename: f.filename,
  }));

  // Save geolocation
  newListing.geometry = geoData;

  await newListing.save();
  req.flash("success", "New Listing Created!");
  res.redirect("/listings");
};

/**
 * Render the form to edit an existing listing.
 */
module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing you requested for does not exist!");
    return res.redirect("/listings");
  }
  res.render("listings/edit", { listing });
};

/**
 * Update listing data, including image upload and deletion.
 */
module.exports.updateListing = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

  // Step 1: Delete selected images from Cloudinary and DB
  if (req.body.deleteImages) {
    for (let filename of req.body.deleteImages) {
      await cloudinary.uploader.destroy(filename); // remove from Cloudinary
      listing.images = listing.images.filter(
        (img) => img.filename !== filename
      ); // remove from DB
    }
  }

  // Step 2: Add newly uploaded images
  if (req.files && req.files.length > 0) {
    const newImgs = req.files.map((f) => ({
      url: f.path,
      filename: f.filename,
    }));
    listing.images = [...listing.images, ...newImgs].slice(0, 5); // Max 5 images
  }

  await listing.save();
  req.flash("success", "Listing Updated!");
  res.redirect(`/listings/${id}`);
};

/**
 * Delete a listing and its associated data.
 */
module.exports.destroyListing = async (req, res) => {
  const { id } = req.params;
  const deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  req.flash("success", "Listing Deleted!");
  res.redirect("/listings");
};
