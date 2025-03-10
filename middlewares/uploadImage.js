const multer = require("multer");
const sharp = require("sharp");

// Use memory storage since we work with buffers
const storage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new Error("Unsupported file format"), false);
  }
};

const uploadPhoto = multer({
  storage: storage,
  fileFilter: multerFilter,
  limits: { fileSize: 1000000 }, // 1MB size limit
});

// Resize product images and update file.buffer
const productImgResize = async (req, res, next) => {
  if (!req.files || req.files.length === 0) return next();

  try {
    await Promise.all(
      req.files.map(async (file) => {
        console.log("Processing product image:", file.originalname);

        const resizedBuffer = await sharp(file.buffer)
          .resize(300, 300)
          .toFormat("jpeg")
          .jpeg({ quality: 90 })
          .toBuffer();

        if (!resizedBuffer || resizedBuffer.length === 0) {
          throw new Error(`Processed image buffer is empty for file: ${file.originalname}`);
        }

        // Replace the original buffer with the resized one
        file.buffer = resizedBuffer;
      })
    );
    next();
  } catch (error) {
    console.error("Error resizing product image:", error);
    res.status(500).json({ error: error.message });
  }
};

// Resize blog images similarly (if needed) without writing to disk
const blogImgResize = async (req, res, next) => {
  if (!req.files || req.files.length === 0) return next();

  try {
    await Promise.all(
      req.files.map(async (file) => {
        console.log("Processing blog image:", file.originalname);

        const resizedBuffer = await sharp(file.buffer)
          .resize(300, 300)
          .toFormat("jpeg")
          .jpeg({ quality: 90 })
          .toBuffer();

        // Optionally, attach Cloudinary info after upload if required:
        // const uploadResult = await cloudinaryUploadImg(resizedBuffer);
        // file.cloudinary = uploadResult;

        // Update the file buffer with the resized version
        file.buffer = resizedBuffer;
      })
    );
    next();
  } catch (error) {
    console.error("Error resizing blog image:", error);
    res.status(500).json({ error: "Error processing blog image" });
  }
};

module.exports = { uploadPhoto, productImgResize, blogImgResize };
