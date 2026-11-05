const { InferenceClient } = require('@huggingface/inference');

const hfClient = new InferenceClient(process.env.HF_API_TOKEN);
const HF_MODEL_URL = process.env.HF_MODEL_URL || '';

module.exports = { hfClient, HF_MODEL_URL };
