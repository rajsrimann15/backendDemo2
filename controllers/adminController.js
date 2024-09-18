const asyncHandler = require("express-async-handler");
const PackingAndMovingOrderModel = require("../models/PackingAndMovingOrderModel");
const LongDistanceMovingOrderModel = require("../models/LongDistanceMovingOrderModel");
const oneSignal = require('@onesignal/node-onesignal');
const LocalMovingOrderModel = require("../models/LocalMovingOrderModel");

//push notification service setup
const clientAppConfig = oneSignal.createConfiguration({
  appKey: '46aa1153-5f3d-4468-a2bd-98f8f664ef6d',
  restApiKey: 'MGYwMGRjYzQtZTk1OC00N2NlLTg4NzUtN2MxYmRiYWRhNjNi',
});

const oneSignalClient = new oneSignal.DefaultApi(clientAppConfig);

async function createClientAppNotification(userId, name, headings, content, metaData) {
  //the notification

  const notification = new oneSignal.Notification();
  notification.app_id = '46aa1153-5f3d-4468-a2bd-98f8f664ef6d';

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
  
  notification.filters = [
    {
      field: 'tag',
      key: 'userId',
      relation: '=',
      value: userId
    },
  ];

  await oneSignalClient.createNotification(notification);
}

const adminGetAllOrders
 = asyncHandler(async (req, res) => {
    const allOrders = (await PackingAndMovingOrderModel.find()).concat(await LongDistanceMovingOrderModel.find());
    console.log(allOrders);
    res.status(200).json(allOrders);
  });

//@desc Get PackingAndMovingOrder
//@route GET /orders/packingAndMovingOrder/:orderid
//@access private
const adminGetPackingAndMovingOrder = asyncHandler(async (req, res) => {
  const order =  await PackingAndMovingOrderModel.find({orderId: req.params.id});
  if (!order)
    res.status(404).json({message: 'no data'});

  else 
    res.status(200).json(order);
});

//@desc Update order
//@route PUT /orders/admin/order/:id
//@access private
const adminUpdatePackingAndMovingOrder = asyncHandler(async (req, res) => {
  if (!req.body.parameter || !req.body.value) res.status(400).json({message: 'Some fields are missing.'});

  console.log(`reqest id is : ${req.params.id}`);
  console.log(`request body is : ${req.body}`);

  try {
    const updatedOrder = await PackingAndMovingOrderModel.findOneAndUpdate(
      { orderId: req.params.id },
      { $set: { [req.body.parameter]: req.body.value, [`statusUpdateLog.${req.body.value}`]: {'updatedAt': new Date().toISOString(), 'viewedByUser': false }} },
      { new: true } // Return the updated document
    );
    
    if (updatedOrder) {
      createClientAppNotification(updatedOrder.user_id, `Order ${req.body.value}`, `Order ${req.params.id.toUpperCase()} ${req.body.value == 'orderPicked' ? 'picked' : req.body.value}`, `Your order has been ${req.body.value == 'orderPicked' ? 'picked' : req.body.value}` , {notificationType: 'orderChanged'});
      res.status(200).json({message:`${req.body.parameter} changed.`});
    }
    else {
      res.status(404).json({message: 'Order not found.'});
    }
  } catch (error) {
    res.status(500).json({message: 'Couldn\'t update changes, please try again.'});
  }
});

//@desc Delete order
//@route DELETE /orders/admin/order/:id
//@access private
const adminDeletePackingAndMovingOrder = asyncHandler(async (req, res) => {
  console.log(`reqest id is : ${req.params.id}`);
  
  try {
    const deletedCount = await PackingAndMovingOrderModel.deleteOne({orderId: req.params.id});
    
    if (deletedCount.deletedCount === 1) res.status(200).json({message:`order : ${req.params.id} removed`});
    else res.status(404).json({message: 'Order not found.'});
    
  } catch (error) {
    res.status(500).json({message: 'Couldn\'t update changes, please try again.'});
  }
});

//@desc Get PackingAndMovingOrder
//@route GET /api/packingAndMovingOrder/:orderid
//@access private
const adminGetLongDistanceMovingOrder = asyncHandler(async (req, res) => {
  const order =  await LongDistanceMovingOrderModel.find({orderId: req.params.id});
  if (!order)
    res.status(404).json({message: 'no data'});

  else 
    res.status(200).json(order);
});

//@desc Update order
//@route PUT /api/admin/order/:id
//@access private
const adminUpdateLongDistanceMovingOrder = asyncHandler(async (req, res) => {
  if (!req.body.parameter || !req.body.value) res.status(400).json({message: 'Some fields are missing.'});

  console.log(`reqest id is : ${req.params.id}`);
  console.log(`request body is : ${req.body}`);

  try {
    const updatedOrder = await LongDistanceMovingOrderModel.findOneAndUpdate(
      { orderId: req.params.id },
      { $set: { [req.body.parameter]: req.body.value, [`statusUpdateLog.${req.body.value}`]: {'updatedAt': new Date().toISOString(), 'viewedByUser': false }} },
      { new: true } // Return the updated document
    );
    
    if (updatedOrder) {
      createClientAppNotification(updatedOrder.user_id, `Order ${req.body.value}`, `Order ${req.params.id.toUpperCase()} ${req.body.value == 'orderPicked' ? 'picked' : req.body.value}`, `Your order has been ${req.body.value == 'orderPicked' ? 'picked' : req.body.value}` , {notificationType: 'orderChanged'});
      res.status(200).json({message:`${req.body.parameter} changed.`});
    }
    else {
      res.status(404).json({message: 'Order not found.'});
    }
  } catch (error) {
    res.status(500).json({message: 'Couldn\'t update changes, please try again.'});
  }
});

//@desc Delete order
//@route DELETE /api/admin/order/:id
//@access private
const adminDeleteLongDistanceMovingOrder = asyncHandler(async (req, res) => {
  console.log(`reqest id is : ${req.params.id}`);
  
  try {
    const deletedCount = await LongDistanceMovingOrderModel.deleteOne({orderId: req.params.id});
    
    if (deletedCount.deletedCount === 1) res.status(200).json({message:`order : ${req.params.id} removed`});
    else res.status(404).json({message: 'Order not found.'});
    
  } catch (error) {
    res.status(500).json({message: 'Couldn\'t update changes, please try again.'});
  }
});

//@desc Get PackingAndMovingOrder
//@route GET /api/packingAndMovingOrder/:orderid
//@access private
const adminGetLocalMovingOrder = asyncHandler(async (req, res) => {
  const order =  await LocalMovingOrderModel.find({orderId: req.params.id});
  if (!order)
    res.status(404).json({message: 'no data'});

  else 
    res.status(200).json(order);
});

//@desc Update order
//@route PUT /api/admin/order/:id
//@access private
const adminUpdateLocalMovingOrder = asyncHandler(async (req, res) => {
  if (!req.body.parameter || !req.body.value) res.status(400).json({message: 'Some fields are missing.'});

  console.log(`reqest id is : ${req.params.id}`);
  console.log(`request body is : ${req.body}`);

  try {
    const updatedOrder = await LocalMovingOrderModel.findOneAndUpdate(
      { orderId: req.params.id },
      { $set: { [req.body.parameter]: req.body.value, [`statusUpdateLog.${req.body.value}`]: {'updatedAt': new Date().toISOString(), 'viewedByUser': false }} },
      { new: true } // Return the updated document
    );
    
    if (updatedOrder) {
      createClientAppNotification(updatedOrder.user_id, `Order ${req.body.value}`, `Order ${req.params.id.toUpperCase()} ${req.body.value == 'orderPicked' ? 'picked' : req.body.value}`, `Your order has been ${req.body.value == 'orderPicked' ? 'picked' : req.body.value}` , {notificationType: 'orderChanged'});
      res.status(200).json({message:`${req.body.parameter} changed.`});
    }
    else {
      res.status(404).json({message: 'Order not found.'});
    }
  } catch (error) {
    res.status(500).json({message: 'Couldn\'t update changes, please try again.'});
  }
});

//@desc Delete order
//@route DELETE /api/admin/order/:id
//@access private
const adminDeleteLocalMovingOrder = asyncHandler(async (req, res) => {
  console.log(`reqest id is : ${req.params.id}`);
  
  try {
    const deletedCount = await LocalMovingOrderModel.deleteOne({orderId: req.params.id});
    
    if (deletedCount.deletedCount === 1) res.status(200).json({message:`order : ${req.params.id} removed`});
    else res.status(404).json({message: 'Order not found.'});
    
  } catch (error) {
    res.status(500).json({message: 'Couldn\'t update changes, please try again.'});
  }
});

module.exports={adminGetAllOrders, adminGetPackingAndMovingOrder, adminDeletePackingAndMovingOrder, adminDeletePackingAndMovingOrder, adminUpdatePackingAndMovingOrder, adminGetLongDistanceMovingOrder, adminUpdateLongDistanceMovingOrder, adminDeleteLongDistanceMovingOrder, adminGetLocalMovingOrder, adminUpdateLocalMovingOrder, adminDeleteLocalMovingOrder};