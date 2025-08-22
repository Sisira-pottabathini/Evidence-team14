"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const fileSchema = new mongoose_1.default.Schema({
    filename: {
        type: String,
        required: true
    },
    contentType: {
        type: String,
        required: true
    },
    size: {
        type: Number,
        required: true
    },
    gridFSId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: true
    }
});
const evidenceSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: [true, 'Please provide an evidence name'],
        trim: true,
        maxlength: [200, 'Evidence name cannot be more than 200 characters']
    },
    description: {
        type: String,
        trim: true,
        maxlength: [1000, 'Description cannot be more than 1000 characters']
    },
    folderId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Folder',
        required: true
    },
    secretKey: {
        type: String,
        required: [true, 'Please provide a secret key'],
        minlength: [6, 'Secret key must be at least 6 characters'],
        select: false
    },
    videos: [fileSchema],
    images: [fileSchema],
    audios: [fileSchema],
    createdAt: {
        type: Date,
        default: Date.now
    }
});
// Hash secret key before saving
evidenceSchema.pre('save', async function (next) {
    if (!this.isModified('secretKey')) {
        return next();
    }
    const salt = await bcryptjs_1.default.genSalt(10);
    this.secretKey = await bcryptjs_1.default.hash(this.secretKey, salt);
    next();
});
// Compare secret key method
evidenceSchema.methods.compareSecretKey = async function (candidateKey) {
    return bcryptjs_1.default.compare(candidateKey, this.secretKey);
};
exports.default = mongoose_1.default.model('Evidence', evidenceSchema);
