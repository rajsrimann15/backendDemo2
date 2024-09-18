const asyncHandler = require("express-async-handler");
const oneSignal = require('@onesignal/node-onesignal');
const packingAndMovingOrderModel = require("../models/PackingAndMovingOrderModel");
const PackingAndMovingOrderModel = require("../models/PackingAndMovingOrderModel");

//push notification service setup
const adminAppConfig = oneSignal.createConfiguration({
  appKey: '277ba336-f81d-4a1e-b7cb-4913fceb9ebf',
  restApiKey: 'MWMzODc2YzctOTg3Yy00MjcyLTk0YjYtYzAwZmU2MTYxN2M1',
});

const oneSignalAdminClient = new oneSignal.DefaultApi(adminAppConfig);

async function createAdminAppNotification(name, headings, content, metaData) {
  //the notification

  const notification = new oneSignal.Notification();
  notification.app_id = '277ba336-f81d-4a1e-b7cb-4913fceb9ebf';

  // Name property may be required in some case, for instance when sending an SMS.
  notification.name = name;
  notification.contents = {
      en: content
  }

  // required for Huawei
  notification.headings = {
      en: headings
  }

  notification.data = metaData;
  
  notification.included_segments = ["All"];
  await oneSignalAdminClient.createNotification(notification);
}

//*********************GET && POST******************

//@desc Get all packingAndMovingOrder
//@route GET /order/packingAndMovingOrder
//@access private
const getPackingAndMovingOrders = asyncHandler(async (req, res) => {
  const packingAndMovingOrders = await packingAndMovingOrderModel.find({user_id:req.user.userId});
  if(packingAndMovingOrders) res.status(200).json(packingAndMovingOrders);
  else res.status(404).json({message:"not found"});
});

//@desc Create New PackingAndMovingOrder
//@route POST /order/packingAndMovingOrder
//@access private
const createPackingAndMovingOrder = asyncHandler(async (req, res) => {
  console.log("The request body is :", req.body);
  const name = req.body.name;
  const phone = req.body.phone;
  const recieveAddress = req.body.locationData;
  const itemsToShip = req.body.itemsToShip;
  const totalItems = req.body.totalItems;

  if (!name || !phone || !recieveAddress || !itemsToShip || !totalItems) {
    console.log('Error');
    res.status(400);
  }

  try {
 
    const results = await PackingAndMovingOrderModel.find();
    const countString = results.length.toString().padStart(4, "0");
    
    var order = {
      'user_id': req.user.userId,
      'orderId': `pcm${recieveAddress.startingDistrict.slice(0, 3)}${countString}${recieveAddress.destinationDistrict.slice(0, 3)}`,
      'name': name,
      'phone': phone,
      'recieveAddress': recieveAddress,
      'itemsToShip': itemsToShip,
      'totalItems': totalItems,
      'status': 'orderPlaced',
      'statusUpdateLog': {
        'orderPlaced': {},
        'accepted': {},
        'rejected': {},
        'orderPicked': {},
        'delivered': {}
      }
    };

    const packingAndMovingOrder = await packingAndMovingOrderModel.create(order);

    console.log(packingAndMovingOrder);

    createAdminAppNotification('Manage order', `Order ID : PCM${recieveAddress.startingDistrict.slice(0, 3).toUpperCase()}${countString}${recieveAddress.destinationDistrict.slice(0, 3).toUpperCase()}`, 'New packing and moving order', {notificationType: 'newOrder', orderId: `pcm${recieveAddress.startingDistrict.slice(0, 3)}${countString}${recieveAddress.destinationDistrict.slice(0, 3)}`, orderType: 'packingAndMovingOrder'});
    
    res.status(200).json(packingAndMovingOrder);
    res.end();
  } catch (error) {
    console.log(error);
  }
});

//@desc Get PackingAndMovingOrder
//@route GET /order/packingAndMovingOrder/:orderid
//@access private
const getPackingAndMovingOrder = asyncHandler(async (req, res) => {
  const order =  await packingAndMovingOrderModel.find({user_id:req.user.id});
  if (!order)
    res.status(404).json({message: 'no data'});

  else 
    res.status(200).json(order);
});

const updatePackingAndMovingOrder = asyncHandler(async (req, res) => {
  if (!req.body.value) res.status(400).json({message: 'Some fields are missing.'});

  try {
    const updatedOrder = await packingAndMovingOrderModel.findOneAndUpdate(
      { orderId: req.params.id },
      { $set: { [`statusUpdateLog.${req.body.value}.viewedByUser`]: true } },
      { new: true } // Return the updated document
    );
    
    if (updatedOrder) {      
      res.status(200).json({message:`${req.body.value} viewed by user.`});
    }
    else {
      res.status(404).json({message: 'Order not found.'});
    }
  } catch (error) {
    res.status(500).json({message: 'Couldn\'t update changes, please try again.'});
  }
});



module.exports = {
  getPackingAndMovingOrders,
  createPackingAndMovingOrder,
  getPackingAndMovingOrder,
  updatePackingAndMovingOrder,
};