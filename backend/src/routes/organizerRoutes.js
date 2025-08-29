// routes/organizerRoutes.js

import express from "express";
import { 
    submitOrganizerApplication, 
    getOrganizerApplicationStatus 
} from "../controller/organizerController/organizerApplication.js";

const router = express.Router();

// Submit organizer application
router.post("/apply", submitOrganizerApplication);

// Get application status for a user
router.get("/application-status/:userId", getOrganizerApplicationStatus);

// Get all applications (for admin)
// router.get("/applications", getAllApplications); // You can implement this later

// Update application status (for admin)
// router.patch("/applications/:applicationId", updateApplicationStatus); // You can implement this later

export default router;