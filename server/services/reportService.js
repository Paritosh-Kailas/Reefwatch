const Report = require('../models/report');

const generateReport = async ({ title, type, userId, filters }) => {
  const doc = await Report.create({
    title,
    reportType: type,
    createdBy: userId,
    filters,
    status: 'pending',
  });
  // TODO: async PDF generation
  return doc;
};

module.exports = { generateReport };
