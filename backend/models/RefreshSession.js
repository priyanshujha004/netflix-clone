import mongoose from 'mongoose';

const refreshSessionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    },
    jti: {
        type: String,
        required: true,
        unique: true,
        index: true,
    },
    familyId: {
        type: String,
        required: true,
        index: true,
    },
    expiresAt: {
        type: Date,
        required: true,
        index: { expires: 0 },
    },
    revokedAt: Date,
    replacedBy: String,
    userAgent: String,
}, { timestamps: true });

refreshSessionSchema.index({ familyId: 1, revokedAt: 1 });

const RefreshSession = mongoose.model('RefreshSession', refreshSessionSchema);
export default RefreshSession;
