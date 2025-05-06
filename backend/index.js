import express from 'express'
import dotenv from "dotenv"
import cors from "cors"
import { connectDB } from './db/connection.js';
import authRoutes from './routes/authRoutes.js'
import marksRoutes from './routes/marksRoutes.js'
import reportRoutes from './routes/reportRoutes.js'
import dashboardRoutes from './routes/dashboardRoutes.js'
import profileRoutes from './routes/profileRoutes.js'
import unitRoutes from './routes/unitRoutes.js'
import attendanceRoutes from './routes/attendanceRoutes.js'
import cookieParser from 'cookie-parser';
import cron from 'node-cron';
import { Permission } from './models/permissionModel.js';
import jibbleRoutes from './routes/jibbleRoutes.js'

import { GoogleGenAI } from "@google/genai";
import { getAttendance } from "./functions/attendanceFuntions.js"
// attendanceFunctions.js
import { Attendance } from "./models/attendanceModel.js";

dotenv.config()
const PORT = process.env.PORT || 5000;

const app = express();
app.use(cors({
  methods: ["GET", "POST", "PUT", "DELETE"],
  origin: "http://localhost:5173",
  credentials: true,
}));

app.use(express.json()); // it allows us to pass the incoming requests as json payloads ( req.body )
app.use(cookieParser()); // it allows us to pass the cookies


// Run a cron job every day at midnight
cron.schedule('0 0 * * *', async () => {
  try {
    const now = new Date();
    // Delete all permissions that have expired
    await Permission.deleteMany({ expiresAt: { $lt: now } });
    console.log('Expired permissions deleted');
  } catch (error) {
    console.error('Error deleting expired permissions:', error);
  }
});


app.use("/api/auth", authRoutes)
app.use("/api/dashboard", dashboardRoutes)
app.use("/api/marksManagement", marksRoutes)
app.use("/api/reports", reportRoutes);
app.use("/api/units/", unitRoutes)
app.use("/api/attendance", attendanceRoutes)
// routes for frontend 
app.use("/api/user", profileRoutes);


const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });


async function getAIResponse(query) {
  try {
    // Send a request to the Gemini model for generating content
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash", // Replace with your desired model
      contents: query, // The query from the frontend (e.g., user input)
    });
    return response.text; // Return the response text
  } catch (error) {
    console.error("Error interacting with Gemini API:", error);
    throw new Error("Failed to fetch AI response");
  }
}

// Attendance Check Route
app.post('/checkAttendance', async (req, res) => {
  const { enrollment, date, subject } = req.body; // Receive enrollment, date, and subject

  console.log('Checking Attendance:', enrollment, date, subject); // Debugging log

  // Call the function to check attendance
  const attendance = await getAttendance(enrollment, date, subject);

  if (attendance.present) {
    res.json({
      message: `${enrollment} was present in ${subject} on ${date}.`,
      attendanceTakenBy: attendance.attendanceTakenBy,
    });
  } else {
    res.json({
      message: `${enrollment} was absent in ${subject} on ${date}.`,
      error: attendance.message,
    });
  }
});

app.post('/api/getAIResponse', async (req, res) => {
  const { query } = req.body;

  try {
    if (query.toLowerCase().includes('attendance') || query.toLowerCase().includes('present') || query.toLowerCase().includes('absent')) {
      const enrollmentMatch = query.match(/\d{10}/);
      const dateMatch = query.match(/(\d{2}-\d{2}-\d{4})/);
      const subjectMatch = query.match(/subject\s*:\s*(.+)/i);

      if (enrollmentMatch && dateMatch && subjectMatch) {
        const enrollment = enrollmentMatch[0];
        const date = dateMatch[0];
        const subject = subjectMatch[1].trim();

        // Debug logs
        console.log("Checking for enrollment:", enrollment, "Type:", typeof enrollment);
        console.log("Checking for date:", date, "Type:", typeof date);
        console.log("Checking for subject:", subject, "Type:", typeof subject);

        const formattedDate = date.split('-').reverse().join('-'); // "DD-MM-YYYY" -> "YYYY-MM-DD"
        const jsDate = new Date(formattedDate); // Convert string to Date object
        console.log("Formatted Date:", jsDate, "Type:", typeof jsDate);
        console.log("Formatted Date (raw):", formattedDate);

        // Step 1: Fetch all attendance records for the enrollment
        const allRecords = await Attendance.find({ enrollment: enrollment.trim() });
        console.log("All Records for Enrollment: are coming");

        // Step 2: Match only those with the same date (ignoring time)
        const inputDateString = jsDate.toISOString().split('T')[0]; // "YYYY-MM-DD"
        const dateMatchedRecords = allRecords.filter((rec) => {
          const recordDateString = new Date(rec.date).toISOString().split('T')[0];
          return recordDateString === inputDateString;
        });

        console.log("Date matched recs", dateMatchedRecords);



        // Step 3: From those records, match subject
        const record = dateMatchedRecords.find((rec) => {
          console.log("Record subject:", rec.subject);
          console.log("Input subject:", subject);

          // Normalize both strings by trimming whitespace and converting to lowercase for case-insensitive comparison
          return rec.subject.trim().toLowerCase() === subject.trim().toLowerCase();
        });

        console.log("Record found:", record);

        // Step 4: Return response based on presence
        if (record) {
          res.json({
            answer: `${enrollment} was present in ${subject} on ${date}. Attendance was taken by ${record.attendanceTakenBy || 'unknown'}.`,
          });
        } else {
          res.json({
            answer: `${enrollment} was absent in ${subject} on ${date}.`,
          });
        }

      } else {
        res.json({
          answer: "Please provide enrollment number, date, and subject in your query. Example: 1234567890 on 25-04-2025 for subject: Math",
        });
      }
    } else {
      const aiResponse = await getAIResponse(query); // Use Gemini AI for non-attendance queries
      res.json({ answer: aiResponse });
    }
  } catch (error) {
    console.error("Error processing the request:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



// routes for jibble
app.use("/api/jibble", jibbleRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB()
})