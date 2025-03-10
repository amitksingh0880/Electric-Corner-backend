const asyncHandler = require("express-async-handler");
const { cloudinaryUploadImg, cloudinaryDeleteImg } = require("../utils/cloudinary");

const uploadImages = asyncHandler(async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "No files uploaded" });
    }

    // Upload images using the resized buffer from the previous middleware
    const uploadPromises = req.files.map(async (file) => {
      const cloudinaryResult = await cloudinaryUploadImg(file.buffer);
      return cloudinaryResult;
    });

    const uploadedImages = await Promise.all(uploadPromises);
    res.json(uploadedImages);
  } catch (error) {
    console.error("Upload Error:", error);
    res.status(500).json({ error: error.message });
  }
});

const deleteImages = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    await cloudinaryDeleteImg(id); // Pass only the id/public_id
    res.json({ message: "Deleted successfully" });
  } catch (error) {
    console.error("Delete Error:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = { uploadImages, deleteImages };
