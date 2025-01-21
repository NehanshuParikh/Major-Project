import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
  {
    userType: {
      type: String,
      required: true,
    },
    enrollment: {
      type: String,
      required: true, // Student/Faculty enrollment or unique identifier
    },
    date: {
      type: Date,
      required: true,
    },
    time: {
      type: String, // Store time as a string, e.g., "13:30:12"
      required: true,
    },
    level: {
      type: String,
      required: true, // e.g., Diploma, Degree, etc.
      lowercase: true,
    },
    branch: {
      type: String,
      required: true, // e.g., IT, CS, etc.
      uppercase: true,
    },
    school: {
      type: String,
      required: true, // e.g., KSET
      uppercase: true,
    },
    semester: {
      type: String,
      required: true, // e.g., 5
    },
    division: {
      type: String,
      required: true, // e.g., 2 (Division or Section)
    },
    subject: {
      type: String,
      required: true, // e.g., Web Programming
    },
    attendanceTakenBy: {
      type: String,
      required: true, // Faculty name
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt timestamps
  }
);

// // Create indexes for faster query filtering
// attendanceSchema.index({ enrollment: 1, date: 1 }); // Query by student and date
// attendanceSchema.index({ branch: 1, semester: 1, division: 1, subject: 1 }); // Query by class details


export const Attendance = mongoose.model("Attendance", attendanceSchema);
