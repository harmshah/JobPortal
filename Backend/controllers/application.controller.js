import Application from "../models/application.model.js";
import Job from "../models/job.model.js";

export const applyJob = async (req, res) => {
  try {
    const jobId = req.params.id; // Assuming jobId is sent in the request body
    const userId = req.id; // Assuming req.id is set by the authentication middleware

    if (!jobId) {
      return res.status(400).json({
        message: "Job ID is required",
        success: false,
      });
    }

    // Check if the job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        message: "Job not found",
        success: false,
      });
    }

    const existingApplication = await Application.findOne({
      job: jobId,
      applicant: userId,
    });

    if (existingApplication) {
      return res.status(400).json({
        message: "You have already applied for this job",
        success: false,
      });
    }
    // Fetch the job to ensure it exists
    // Create a new application
    const application = new Application({
      job: jobId,
      applicant: userId,
    });

    // Save the application

    await application.save();
    job.applicants.push(userId);
    await job.save();

    return res.status(201).json({
      message: "Job application submitted successfully",
      success: true,
      application,
    });
  } catch (error) {
    console.error("Error applying for job:", error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

export const getAppliedJobs = async (req, res) => {
  try {
    const userId = req.id; // Assuming req.id is set by the authentication middleware

    // Find all application made by the user
    const application = await Application.find({ applicant: userId })
      .sort({ createdAt: -1 })
      .populate({
        path: "job",
        options: { sort: { createdAt: -1 } },
        populate: { path: "company", options: { sort: { createdAt: -1 } } },
      });

    if (!application || application.length === 0) {
      return res.status(404).json({
        message: "No applied jobs found for this user",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Applied jobs retrieved successfully",
      success: true,
      application,
    });
  } catch (error) {
    console.error("Error retrieving applied jobs:", error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

export const getApllicants = async (req, res) => {
  try {
    const jobId = req.params.id; // Assuming jobId is sent in the request body

    if (!jobId) {
      return res.status(400).json({
        message: "Job ID is required",
        success: false,
      });
    }

    // Check if the job exists
    const job = await Job.findById(jobId).populate({
      path: "application",
      options: { sort: { createdAt: -1 } },
      populate: { path: "applicant", options: { sort: { createdAt: -1 } } }, // Assuming applicants are users
    });
    if (!job) {
      return res.status(404).json({
        message: "Job not found",
        success: false,
      });
    }

    if (job.applicants.length === 0) {
      return res.status(404).json({
        message: "No applicants found for this job",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Applicants retrieved successfully",
      success: true,
      applicants: job.applicants,
    });
  } catch (error) {
    console.error("Error retrieving applicants:", error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

export const updateStatus = async (req, res) => {
    try {
      const applicationId = req.params.id; // Get from URL param
      const { status } = req.body;
  
      if (!applicationId) {
        return res.status(400).json({
          message: "Application ID is required",
          success: false,
        });
      }
  
      if (!["Pending", "Rejected", "Accepted"].includes(
        status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()
      )) {
        return res.status(400).json({
          message: "Invalid status value",
          success: false,
        });
      }
  
      // Find the application
      const application = await Application.findById(applicationId);
      if (!application) {
        return res.status(404).json({
          message: "Application not found",
          success: false,
        });
      }
  
      // Set and save status
      application.status = status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
      await application.save();
  
      return res.status(200).json({
        message: "Application status updated successfully",
        success: true,
        application,
      });
    } catch (error) {
      console.error("Error updating application status:", error);
      return res.status(500).json({
        message: "Internal server error",
        success: false,
      });
    }
  };
  