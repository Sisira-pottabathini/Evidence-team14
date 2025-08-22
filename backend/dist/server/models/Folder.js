"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const folderSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a folder name'],
        trim: true,
        maxlength: [100, 'Folder name cannot be more than 100 characters']
    },
    password: {
        type: String,
        required: [true, 'Please provide a folder password'],
        minlength: [6, 'Folder password must be at least 6 characters'],
        select: false
    },
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});
// Hash password before saving
folderSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    const salt = await bcryptjs_1.default.genSalt(10);
    this.password = await bcryptjs_1.default.hash(this.password, salt);
    next();
});
// Compare password method
folderSchema.methods.comparePassword = async function (candidatePassword) {
    return bcryptjs_1.default.compare(candidatePassword, this.password);
};
exports.default = mongoose_1.default.model('Folder', folderSchema);
