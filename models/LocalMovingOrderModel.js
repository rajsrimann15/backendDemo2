const mongoose = require("mongoose");

const localDistanceMovingSchema = mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    orderId: {
      type: String,
      required: [true, 'Order id is missing'],
    },
    name: {
        type: String,
        required: [true, "Please add the name"],
    },
    phone: {
        type: String,
        required: [true, "Please add the phone number of sender"],
    },
    sender: {
      type: Map,
      required: [true, "Please add the sender details"],
    },
    reciever: {
      type: Map,
      required: [true, "Please add the reciever details"],
    },
    stoppings: {
      type: Array,
      required: [true, "Please add the stoppings"],
    },
    requestedVehicle: {
      type: Map,
      required: [true, "Please add the requested vehicles"],
    },
    status: {
      type: String,
      required: [true, "Status must be set atleast to orderPlaced"] // orderPlaced -> accepted/rejected -> orderPicked->orderDelivered
    },
    statusUpdateLog: {
      type: Map,
      required: [true, "Update log must be initialized"] // {'orderPlaced': {'updatedAt': timestamp, 'viewedByUser': false}}
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("LocalDistanceMovingOrder", localDistanceMovingSchema);