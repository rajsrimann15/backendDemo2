const asyncHandler = require("express-async-handler");
const ChipDetail = require("../models/chipDetailModel");


//*********************GET && POST******************

//@desc Get all chipDetails
//@route GET /chips
//@access private
const getChipDetails = asyncHandler(async (req, res) => {
  const chipDetails = await ChipDetail.find();
  if(chipDetails)res.status(200).json(chipDetails);
  else res.status(404).json({message:"not found"});
});

//@desc Create New chipDetail
//@route POST /chips
//@access private
const postChipDetails = asyncHandler(async (req, res) => {

  console.log("The request body is :", req.body);
  const user_id = req.body.user_id;
  

  if (!user_id) {
    console.log('Error');
    res.status(400);
  }

  try {
 
    var chip = {
      'user_id': user_id
    };

    const createdChip = await ChipDetail.create(chip);
    console.log(createdChip);
    res.status(200).json(createdChip);
    res.end();
  } catch (error) {
    console.log(error);
  }
});

//@desc Get a Chip
//@route GET /chips/id
//@access private
const getChipDetail = asyncHandler(async (req, res) => { 
  const { id } = req.params;
  const chip =  await ChipDetail.findById(id); // using chipId
  //const chip =  await ChipDetail.find({user_id:req.params.id});   // using user_id
  if (!chip)
    res.status(404).json({message: 'no data'});

  else 
    res.status(200).json(chip);
});

//@desc Update PackingAndMovingOrder
//@route PUT /api/packingAndMovingOrder/:id
//@access private

/*{
    "parameter": "user_id",   // Json input
    "value": "null"
  }*/
const updateChipDetail = asyncHandler(async (req, res) => {
  if (!req.body.parameter || !req.body.value) res.status(400).json({message: 'Some fields are missing.'});

  console.log(`reqest id is : ${req.params.id}`);
  console.log(`request body is : ${req.body.value}`)
  
  try {
    const updatedChip = await ChipDetail.findOneAndUpdate(
      { _id: req.params.id },
      { $set: { [req.body.parameter]: req.body.value } },
      { new: true } // Return the updated document
    );
    
    if (updatedChip) {
      res.status(200).json({message:`${req.body.parameter} changed.`});
    }
    else {
      res.status(404).json({message: 'chip not found.'});
    }
  } catch (error) {
    res.status(500).json({message: 'Couldn\'t update changes, please try again.'});
  }
});




module.exports = {
  getChipDetails,
  postChipDetails,
  getChipDetail,
  updateChipDetail
};