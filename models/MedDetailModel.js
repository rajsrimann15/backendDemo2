const mongoose = require("mongoose");

const MedDetailsSchema = mongoose.Schema(
    {
        user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
        },
        name:{
            type: String,
            required: [true, 'Name is missing'],
          },
          age:{
            type: Number,
            required: [true, 'Age is missing'],
          },
          dateOfBirth:{
            type:  Date ,
            required: [true, 'Date of birth is missing'],
          },
          profession:{
            type: String,
            required: [true, 'Profession is missing'],
          },
        email:{
            type: String,
            required: [true, 'Email is missing'],
          },
        phone:{
            type: String,
            required: [true, 'Phone Number is missing'],
          },
          address:{
            type: String,
            required: [true, 'Address is missing'],
          },
          bio:{
            type: String,
            required: [true, 'Biois missing'],
          },
          image:{
            type: String,
            required: [true, 'Image is missing'],
          },
          contacts: {
            type: Map,
            required: [true, "Contact Number are missing"],
          },
          medicalInfo: {
            issues:{
            type: String,
            required: [true, "Medica Info are missing"],
          }
        },
          consultedDoctors: {
            type: Map,
            required: [true, "Please add the consulted Docter"],
          },
          chip_id:{
            type: String,
            required: [true, 'Chip id id is missing'],
          },
          ownedChip_ids:{
            type: [String],
          }
        },
        {
            timestamps: true,
        }
    
  );
  
  module.exports = mongoose.model("MedDetailsModel", MedDetailsSchema);
  