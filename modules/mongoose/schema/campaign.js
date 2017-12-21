const { Schema } = require('mongoose');

const Name = {
  type: String,
  required: true,
}

const Keyword = {
  type: String,
  required: true,
}

const BidAmount = {
  type: Number,
  required: true,
  min: 0,
}

const CampaignFund = {
  type: Number,
  required: true,
  min: 0,
}

const Status = {
  type: Boolean,
  required: true,
  default: true,
}

const Town = {
  type: String,
  required: true,
}

const Radius = {
  type: Number,
  required: true,
  min: 0,
}

module.exports = new Schema({
  name: Name,
  keywords: [Keyword],
  bidAmount: BidAmount,
  campaignFund: CampaignFund,
  status: Status,
  town: Town,
  radius: Radius,
});
