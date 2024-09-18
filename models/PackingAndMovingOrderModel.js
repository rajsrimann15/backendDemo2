const mongoose = require("mongoose");

const packingAndMovingOrderSchema = mongoose.Schema(
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
      required: [true, "Please add the contact name"],
    },
    phone: {
      type: String,
      required: [true, "Please add the contact phone number"],
    },
    recieveAddress: {
      type: Map,
      required: [true, "Please add the contact adresss"],
    },
    itemsToShip: {
      type: Map,
      required: [true, "Please add the items"],
    },
    totalItems: {
      type: String,
      required: [true, "Please mention total items"]
    },
    status: {
      type: String,
      required: [true, "Viewed must be set atleast to false"] // orderPlaced -> accepted/rejected -> orderPicked->orderDelivered
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

module.exports = mongoose.model("PackingAndMovingOrder", packingAndMovingOrderSchema);
