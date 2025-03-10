const cloudinary = require("cloudinary").v2; // Using v2 API

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.SECRET_KEY,
});

const cloudinaryUploadImg = async (buffer) => {
  return new Promise((resolve, reject) => {
    if (!buffer || buffer.length === 0) {
      return reject(new Error("Buffer is empty, cannot upload to Cloudinary"));
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      { resource_type: "image" },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve({
            url: result.secure_url,
            asset_id: result.asset_id,
            public_id: result.public_id,
          });
        }
      }
    );

    uploadStream.end(buffer);
  });
};

const cloudinaryDeleteImg = async (publicId) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(publicId, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve({ message: "Image deleted successfully", result });
      }
    });
  });
};

module.exports = { cloudinaryUploadImg, cloudinaryDeleteImg };
