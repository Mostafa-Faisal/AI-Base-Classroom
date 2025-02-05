"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
// import express, {Request, Response, NextFunction} from 'express';
const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const cors = require('cors');
require('dotenv').config();

const app = express();

// CORS configuration
app.use(cors({
    origin: [
        process.env.FRONTEND_URL || 'http://localhost:5173',  // Your Vite frontend in development
        'https://your-frontend-domain.vercel.app'            // Your frontend on Vercel (update this)
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Use environment variables
const SECRET = process.env.JWT_SECRET || 'SECr3t';  // fallback for development
const MONGODB_URI = process.env.MONGODB_URI;

var userSchema = new mongoose.Schema({
    username: String,
    password: String,
    purchasedCourses: [{
            courseId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Course'
            },
            title: String,
            purchaseDate: { type: Date, default: Date.now }
        }]
});
var adminSchema = new mongoose.Schema({
    username: String,
    password: String
});
var courseSchema = new mongoose.Schema({
    title: String,
    description: String,
    price: Number,
    imageLink: String,
    published: Boolean
});
var User = mongoose.model('User', userSchema);
var Admin = mongoose.model('Admin', adminSchema);
var Course = mongoose.model('Course', courseSchema);
var authenticateJwt = function (req, res, next) {
    var authHeader = req.headers.authorization;
    if (authHeader) {
        var token = authHeader.split(' ')[1];
        jwt.verify(token, SECRET, function (err, user) {
            if (err) {
                res.sendStatus(403);
                return;
            }
            req.user = user;
            next();
        });
    }
    else {
        res.sendStatus(401);
    }
};

// MongoDB connection with error handling
mongoose.connect(MONGODB_URI, {
    dbName: "Courses"
}).then(() => {
    console.log('Connected to MongoDB successfully');
}).catch((err) => {
    console.error('MongoDB connection error:', err);
});

app.get("/admin/me", authenticateJwt, (req, res) => {
    res.json({
        username: req.user.username
    });
});

app.post('/admin/signup', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, username, password, admin, newAdmin, token;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, username = _a.username, password = _a.password;
                return [4 /*yield*/, Admin.findOne({ username: username })];
            case 1:
                admin = _b.sent();
                if (admin) {
                    res.status(403).json({ message: 'Admin already exists' });
                    return [2 /*return*/];
                }
                newAdmin = new Admin({ username: username, password: password });
                return [4 /*yield*/, newAdmin.save()];
            case 2:
                _b.sent();
                token = jwt.sign({ username: username, role: 'admin' }, SECRET, { expiresIn: '1h' });
                res.json({ message: 'Admin created successfully', token: token });
                return [2 /*return*/];
        }
    });
}); });
app.post('/admin/login', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, username, password, admin, token;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, username = _a.username, password = _a.password;
                return [4 /*yield*/, Admin.findOne({ username: username, password: password })];
            case 1:
                admin = _b.sent();
                if (admin) {
                    token = jwt.sign({ username: username, role: 'admin' }, SECRET, { expiresIn: '1h' });
                    res.json({ message: "Logged in successfully", token: token });
                }
                else {
                    res.status(403).json({ message: 'Invalid username or password' });
                }
                return [2 /*return*/];
        }
    });
}); });
app.post('/admin/courses', authenticateJwt, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var course, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                course = new Course(req.body);
                return [4 /*yield*/, course.save()];
            case 1:
                _a.sent();
                res.json({ message: 'Course create successfully', courseId: course.id });
                return [3 /*break*/, 3];
            case 2:
                error_1 = _a.sent();
                if (error_1 instanceof Error) {
                    res.status(500).json({ message: 'Error creating course', error: error_1.message });
                }
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
app.put('/admin/course/:courseId', authenticateJwt, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var course;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, Course.findByIdAndUpdate(req.params.courseId, req.body, { new: true })];
            case 1:
                course = _a.sent();
                if (course) {
                    res.json({ message: 'course update successfully' });
                }
                else {
                    res.status(404).json({ message: 'course not found' });
                }
                return [2 /*return*/];
        }
    });
}); });
app.get('/admin/courses', authenticateJwt, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var courses;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, Course.find({})];
            case 1:
                courses = _a.sent();
                res.json({ courses: courses });
                return [2 /*return*/];
        }
    });
}); });
// User Routes
app.post('/users/signup', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, username, password, user, newUser, token;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, username = _a.username, password = _a.password;
                return [4 /*yield*/, User.findOne({ username: username })];
            case 1:
                user = _b.sent();
                if (user) {
                    res.status(403).json({ message: 'user already exists' });
                    return [2 /*return*/];
                }
                newUser = new User({ username: username, password: password });
                return [4 /*yield*/, newUser.save()];
            case 2:
                _b.sent();
                token = jwt.sign({ username: username, role: 'user' }, SECRET, { expiresIn: '1h' });
                res.json({ message: 'User create successfully', token: token });
                return [2 /*return*/];
        }
    });
}); });
app.post('/users/login', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, username, password, user, token;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, username = _a.username, password = _a.password;
                return [4 /*yield*/, User.findOne({ username: username, password: password })];
            case 1:
                user = _b.sent();
                if (user) {
                    token = jwt.sign({ username: username, role: 'user' }, SECRET, { expiresIn: '1h' });
                    res.json({ message: 'Logged in successfully', token: token });
                }
                else {
                    res.status(403).json({ message: 'Invalid username or password' });
                }
                return [2 /*return*/];
        }
    });
}); });
app.get('/users/courses', authenticateJwt, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var courses;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, Course.find({ published: true })];
            case 1:
                courses = _a.sent();
                res.json({ courses: courses });
                return [2 /*return*/];
        }
    });
}); });
app.post('/users/courses/:courseId', authenticateJwt, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var course, user, purchaseEntry;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, Course.findById(req.params.courseId)];
            case 1:
                course = _a.sent();
                if (!(course && req.user)) return [3 /*break*/, 6];
                return [4 /*yield*/, User.findOne({ username: req.user.username })];
            case 2:
                user = _a.sent();
                if (!user) return [3 /*break*/, 4];
                purchaseEntry = {
                    courseId: course._id,
                    title: course.title,
                    purchaseDate: new Date()
                };
                user.purchasedCourses.push(purchaseEntry);
                return [4 /*yield*/, user.save()];
            case 3:
                _a.sent();
                res.json({ message: 'course purchased successfully' });
                return [3 /*break*/, 5];
            case 4:
                res.status(403).json({ message: 'user not found' });
                _a.label = 5;
            case 5: return [3 /*break*/, 7];
            case 6:
                res.status(404).json({ message: 'course not found' });
                _a.label = 7;
            case 7: return [2 /*return*/];
        }
    });
}); });
app.get('/users/purchasedCourse', authenticateJwt, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!req.user) {
                    res.status(401).json({ message: 'Unauthorized' });
                    return [2 /*return*/];
                }
                return [4 /*yield*/, User.findOne({ username: req.user.username }).populate({
                        path: 'purchasedCourses.courseId',
                        select: 'title description price imageLink'
                    })];
            case 1:
                user = _a.sent();
                if (user) {
                    res.json({ purchaseCourses: user.purchasedCourses || [] });
                }
                else {
                    res.status(403).json({ message: 'user not found' });
                }
                return [2 /*return*/];
        }
    });
}); });
app.listen(3000, function () {
    console.log('server is running on port 3000');
});
