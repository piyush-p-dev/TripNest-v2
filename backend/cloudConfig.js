const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

// ✅ Function to get storage for different folders
const getStorage = (folderName) => {
  return new CloudinaryStorage({
    cloudinary,
    params: {
      folder: `TripNest/${folderName}`, // Use full path like TripNest/Profile
      allowedFormats: ["png", "jpg", "jpeg"],
    },
  });
};

module.exports = {
  cloudinary,
  getStorage, // export this to use dynamically
};
