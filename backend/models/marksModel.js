import mongoose from "mongoose";

const marksSchema = new mongoose.Schema({
    studentId: {
        type: String,
        required: true,
    },
    marks: {
        type: Number,
        required: true
    },
    examType: {
        type: String,
        enum: ['mid-sem-1', 'mid-sem-2', 'external'],
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    level: {
        type: String,
        required: true
    },
    branch: {
        type: String,
        required: true
    },
    division: {
        type: Number,
        required: true
    },
    school: {
        type: String,
        required: true
    },
    semester: {
        type: Number,
        required: true
    }
}, { timestamps: true });

// Compound unique index
marksSchema.index({ studentId: 1, examType: 1, subject: 1, semester: 1 }, { unique: true });
// Compound Index: The line marksSchema.index({ studentId: 1, examType: 1, subject: 1, semester: 1 }, { unique: true }); creates a unique index on the combination of studentId, examType, subject, and semester. This means that the same student can have multiple entries as long as they differ in examType, subject, or semester.

export const Marks = mongoose.model('Marks', marksSchema);
