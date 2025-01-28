import mongoose from "mongoose";

const unitSchema = mongoose.Schema(
    {
        HODId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Staff',
            required: true,
        },
        FacultyId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Staff',
            required: true,
        },
        Level: {
            type: String,
            required: true,
        },
        Branch: {
            type: String,
            required: true,
        },
        School: {
            type: String,
            required: true,
        },
        Semester: {
            type: Number,
            required: true,
        },
        Division: {
            type: Number,
            required: true,
        },
        Subject: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Subject',
            required: true,
        },
        expiresAt: {
            type: Date,
            required: true,
            default: () => new Date(Date.now() + 6 * 30 * 24 * 60 * 60 * 1000), // 6 months from now
        },
    },
    {
        timestamps: true,
    }
);

// Add an index for automatic deletion
unitSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const Unit = mongoose.model('Unit', unitSchema);
