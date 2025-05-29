import mongoose from "mongoose";    

const companySchema = new mongoose.Schema({
companyName: {
    type: String,
    required: true,
    unique: true
},
description: {
    type: String,
    required: true,
},
website: {
    type: String,
    required: true,
},
location: {
    type: String,
    required: true,
},  
userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref:"User",
    required: true,
},
logo: {
    type: String,
    default: "",
},
}, {
timestamps: true,

})
const Company = mongoose.model("Company", companySchema);
export default Company;
