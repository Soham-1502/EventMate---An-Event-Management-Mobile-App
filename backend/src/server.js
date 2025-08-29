import express from "express";
import dotenv from "dotenv";
import userRoutes from "../src/routes/userRoutes.js";
import EventRoutes from "../src/routes/EventRoutes.js";
import TicketRoutes from "../src/routes/TicketRoutes.js";
import organizerRoutes from "../src/routes/organizerRoutes.js"
import job from "./config/cron.js";

const app = express();

//Middleware
// app.use(cors());
app.use(express.json());

if (process.env.NODE_ENV === "production") job.start();

dotenv.config();

const PORT = process.env.PORT || 5001;

app.use("/api/health", (req,res)=>{
    res.status(200).json({status:"ok"})
})

app.use("/api/user",userRoutes);
app.use("/api/events",EventRoutes);
app.use("/api/events", TicketRoutes);
app.use("/api/organizer", organizerRoutes); // Add this line

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: "Something went wrong!",
        error: process.env.NODE_ENV === 'development' ? err.message : 'Internal Server Error'
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found"
    });
});

app.listen(PORT, ()=>{
    console.log(`Server Started at Port ${PORT}`);
})