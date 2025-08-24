import mongoose from 'mongoose';

const GroupSchema = new mongoose.Schema({
    id: {type: String},
    created: {type: Boolean},
    createdAt: {type: Date},
    analyst: {type: String}
}, {
    timestamps: true,
});

export default mongoose.models.Group || mongoose.model('Group', GroupSchema);