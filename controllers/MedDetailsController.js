const asyncHandler = require("express-async-handler");
const MedDetailModel = require("../models/MedDetailModel");


//*********************GET && POST******************

//@desc Get all chipDetails
//@route GET /chips
//@access private
const getMedDetails = asyncHandler(async (req, res) => {
  const medDetails = await MedDetailModel.find();
  if(medDetails)res.status(200).json(medDetails);
  else res.status(404).json({message:"not found"});
});

//@desc Create New chipDetail
//@route POST /chips
//@access private
const postmedDetail = asyncHandler(async (req, res) => {

  console.log("The request body is :", req.body);
  
  const name=req.body.name;
  const age=req.body.age;
  const dateOfBirth=req.body.dateOfBirth;
  const profession=req.body.profession;
  const email=req.body.email;
  const phone=req.body.phone;
  const address=req.body.address;
  const bio=req.body.bio;
  const image=req.body.image;
  const contacts=req.body.contacts;
  const medicalInfo=req.body.medicalInfo;
  const consultedDoctors=req.body.consultedDoctors;
  const chip_id=req.body.chip_id;
  const ownedChip_ids=req.body.ownedChip_ids;
  
  

  if (!chip_id) {
    console.log('Error');
    res.status(400);
  }

  try {
 
    var medDetails = {
      'name':name,
      'age':age,
      'dateOfBirth':dateOfBirth,
      'profession':profession,
      'email':email,
      'phone':phone,
      'address':address,
      'bio':bio,
      'image':image,
      'contacts':contacts,
      'medicalInfo':medicalInfo,
      'consultedDoctors':consultedDoctors,
      'chip_id': chip_id,
      'ownedChip_ids':ownedChip_ids
    };

    const createdMedDetails = await MedDetailModel.create( medDetails);
    console.log( createdMedDetails );
    res.status(200).json( createdMedDetails );
    res.end();
  } catch (error) {
    console.log(error);
  }
});

//@desc Get a Chip
//@route GET /chips/id
//@access private
const getMedDetail = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const chip =  await MedDetailModel.findById(id);
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
const updateMedDetail = asyncHandler(async (req, res) => {
  if (!req.body.parameter || !req.body.value) res.status(400).json({message: 'Some fields are missing.'});

  console.log(`reqest id is : ${req.params.id}`);
  console.log(`request body is : ${req.body.value}`)
  
  try {
    const updatedChip = await MedDetailModel.findOneAndUpdate(
      { _id: req.params.id },
      { $set: { [req.body.parameter]: req.body.value } },
      { new: true } // Return the updated document
    );
    
    if (updatedChip) {
      res.status(200).json({message:`${req.body.parameter} changed.`});
    }
    else {
      res.status(404).json({message: ' not found.'});
    }
  } catch (error) {
    res.status(500).json({message: 'Couldn\'t update changes, please try again.'});
  }
});




module.exports = {
  getMedDetails,
  postmedDetail,
  getMedDetail,
  updateMedDetail
};