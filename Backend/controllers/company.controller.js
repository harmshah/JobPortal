import Company from "../models/company.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const registerCompany = async (req, res) => {
    try {
        const userId = req.id; // Assuming req.id is set by the authentication middleware
        const { companyName, description, website, location } = req.body;
  
      if (!companyName || !description || !website || !location) {
        return res.status(400).json({
          message: "All fields are required",
          success: false,
        });
      }
  
      let company = await Company.findOne({ companyName });
      if (company) {
        return res.status(400).json({
          message: "Company already exists",
          success: false,
        });
      }
  
      company = await Company.create({
        companyName,
        description,
        website,
        location,
        userId: userId,
        // logo: req.file ? req.file.path : ""
      });
  
      return res.status(201).json({
        message: "Company registered successfully",
        success: true,
        company,
      });
    } catch (error) {
      console.error("Error registering company:", error);
      return res.status(500).json({
        message: "Internal server error",
        success: false,
      });
    }
  };
  

export const getAllCompanies = async (req, res) => {
    try {
        const userId = req.id; // Assuming req.id is set by the authentication middleware
        const companies = await Company.find({userId});

        if(!companies){
            return res.status(404).json({
                message: "No companies found for this user",
                success: false,
            });
        }
        return res.status(200).json({
            message: "Companies fetched successfully",
            success: true,
            companies,
        });
    }
    catch (error) { 
        console.error("Error fetching company:", error);
        return res.status(500).json({
            message: "Internal server error",
            success: false,
        });
    }
};

export const getCompanyById = async (req, res) => {
    try{
        const companyId = req.params.id; // Assuming company ID is passed as a URL parameter
        const company = await Company.findById(companyId);
        if (!company) {
            return res.status(404).json({
                message: "Company not found",
                success: false,
            });
        }
        return res.status(200).json({
            message: "Company fetched successfully",
            success: true,
            company,
        });
    } catch (error) {
        console.error("Error fetching company:", error);
        return res.status(500).json({
            message: "Internal server error",
            success: false,
        });
    }
};

export const updateCompany = async (req, res) => {
    try {
        const companyId = req.params.id; // Assuming company ID is passed as a URL parameter
        const file = req.file; // Assuming logo is uploaded and available in req.file
        const { companyName, description, website, location } = req.body;

        const updatedData = {
          companyName,
          description,
          website,
          location,
        };
        

        const company = await Company.findByIdAndUpdate(
            companyId,
            updatedData,
            { new: true }
        );

        if (!company) {
            return res.status(404).json({
                message: "Company not found",
                success: false,
            });
        }

        return res.status(200).json({
            message: "Company updated successfully",
            success: true,
            company: updateCompany,
        });
    } 
    catch (error) 
    {
        console.error("Error updating company:", error);
        return res.status(500).json({
            message: "Internal server error",
            success: false,
        });
    }
};

export const deleteCompany = async (req, res) => {
    try {
        const companyId = req.params.id; // Assuming company ID is passed as a URL parameter
        const deletedCompany = await Company.findByIdAndDelete(companyId);

        if (!deletedCompany) {
            return res.status(404).json({
                message: "Company not found",
                success: false,
            });
        }

        return res.status(200).json({
            message: "Company deleted successfully",
            success: true,
        });
    } catch (error) {
        console.error("Error deleting company:", error);
        return res.status(500).json({
            message: "Internal server error",
            success: false,
        });
    }
};

