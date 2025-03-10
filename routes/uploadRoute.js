const express = require("express");
const { uploadImages, deleteImages } = require("../controller/uploadCtrl");
const { isAdmin, authMiddleware } = require("../middlewares/authMiddleware");
const { uploadPhoto, productImgResize } = require("../middlewares/uploadImage");
const router = express.Router();

router.post(
  "/",
  authMiddleware,
  isAdmin,
  uploadPhoto.array("images", 10),
  (req, res, next) => {
    console.log("Incoming files:", req.files); // Debug log
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "No files uploaded" });
    }
    next();
  },
  productImgResize, // Only resize & update file.buffer
  uploadImages
);

router.delete("/delete-img/:id", authMiddleware, isAdmin, deleteImages);

module.exports = router;
