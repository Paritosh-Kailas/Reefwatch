const { hfClient, HF_MODEL_URL } = require('../config/hfconfig');

/**
 * Run image classification via Hugging Face Inference API
 * @param {Buffer} imageBuffer
 * @returns {Promise<object>} model output
 */
const classifyImage = async (imageBuffer) => {
  const result = await hfClient.imageClassification({
    model: HF_MODEL_URL,
    data: imageBuffer,
  });
  return result;
};

module.exports = { classifyImage };
