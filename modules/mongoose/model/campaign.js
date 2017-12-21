const mongoose = require('mongoose');
const campaignSchema = require('../schema/campaign');

module.exports = mongoose.model('Campaign', campaignSchema);
