const cloudinary = require('../config/cloudinary');

/**
 * Upload a file buffer or local path to Cloudinary
 * @param {string} filePath - temp file path from multer
 * @param {string} folder - cloudinary folder name
 * @returns {Promise<{url: string, publicId: string}>}
 */
const uploadToCloudinary = async (filePath, folder = 'reefwatch') => {
  const result = await cloudinary.uploader.upload(filePath, {
    folder,
    resource_type: 'image',
  });
  return { url: result.secure_url, publicId: result.public_id };
};

/**
 * Delete an image from Cloudinary by public ID
 * @param {string} publicId
 */
const deleteFromCloudinary = async (publicId) => {
  await cloudinary.uploader.destroy(publicId);
};

module.exports = { uploadToCloudinary, deleteFromCloudinary };
