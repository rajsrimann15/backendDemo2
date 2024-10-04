const mongoose = require("mongoose");

const ChipDetailSchema = mongoose.Schema(
  {
    user_id:{
      type: String,
      required: [true, 'user id is missing'],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("ChipDetailModel", ChipDetailSchema);
