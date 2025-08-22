"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swaggerSpec_1 = __importDefault(require("./server/swagger/swaggerSpec"));
const errorHandler_1 = require("./server/middleware/errorHandler");
const authRoutes_1 = __importDefault(require("./server/routes/authRoutes"));
const folderRoutes_1 = __importDefault(require("./server/routes/folderRoutes"));
const evidenceRoutes_1 = __importDefault(require("./server/routes/evidenceRoutes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
// Middleware
app.use((0, cors_1.default)({
    origin: process.env.CLIENT_URL,
    credentials: true
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// API Documentation
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerSpec_1.default));
// Routes
app.use('/api/auth', authRoutes_1.default);
app.use('/api/folders', folderRoutes_1.default);
app.use('/api/evidence', evidenceRoutes_1.default);
// Error Handler
app.use(errorHandler_1.errorHandler);
// Database Connection
const connectDB = async () => {
    try {
        const conn = await mongoose_1.default.connect(process.env.MONGODB_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    }
    catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1);
    }
};
// Start Server
const PORT = process.env.PORT || 5000;
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
    });
});
exports.default = app;
