"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.submitVerification = exports.updateProfile = exports.getProfile = exports.googleSignIn = exports.verifyOTP = exports.requestOTP = exports.login = exports.register = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = require("../config/db");
const JWT_SECRET = process.env.JWT_SECRET || 'propertyhub_super_secret_jwt_key_2026';
const register = async (req, res) => {
    try {
        const { phone, password, fullName, email, role } = req.body;
        if (!phone || !password || !fullName) {
            return res.status(400).json({ error: 'Phone number, password, and full name are required.' });
        }
        const existingUser = await db_1.prisma.user.findUnique({ where: { phone } });
        if (existingUser) {
            return res.status(409).json({ error: 'Phone number already registered.' });
        }
        if (email) {
            const existingEmail = await db_1.prisma.user.findUnique({ where: { email } });
            if (existingEmail) {
                return res.status(409).json({ error: 'Email address already in use.' });
            }
        }
        const passwordHash = await bcrypt_1.default.hash(password, 10);
        const resolvedRole = role && ['BUYER', 'SELLER', 'AGENT', 'ADMIN'].includes(role) ? role : 'BUYER';
        const user = await db_1.prisma.user.create({
            data: {
                phone,
                email: email || null,
                passwordHash,
                role: resolvedRole,
                profile: {
                    create: {
                        fullName,
                        isVerified: false,
                    },
                },
            },
            include: {
                profile: true,
            },
        });
        const token = jsonwebtoken_1.default.sign({ userId: user.id, role: user.role, phone: user.phone }, JWT_SECRET, { expiresIn: '7d' });
        res.status(201).json({
            message: 'User registered successfully',
            token,
            user: {
                id: user.id,
                phone: user.phone,
                email: user.email,
                role: user.role,
                fullName: user.profile?.fullName,
            },
        });
    }
    catch (err) {
        res.status(500).json({ error: err.message || 'Internal server error' });
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const { phone, password } = req.body;
        if (!phone || !password) {
            return res.status(400).json({ error: 'Phone number and password are required.' });
        }
        const user = await db_1.prisma.user.findUnique({
            where: { phone },
            include: { profile: true },
        });
        if (!user || !user.isActive) {
            return res.status(401).json({ error: 'Invalid phone number or inactive account.' });
        }
        const isMatch = await bcrypt_1.default.compare(password, user.passwordHash);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid password.' });
        }
        const token = jsonwebtoken_1.default.sign({ userId: user.id, role: user.role, phone: user.phone }, JWT_SECRET, { expiresIn: '7d' });
        res.status(200).json({
            message: 'Logged in successfully',
            token,
            user: {
                id: user.id,
                phone: user.phone,
                email: user.email,
                role: user.role,
                fullName: user.profile?.fullName,
            },
        });
    }
    catch (err) {
        res.status(500).json({ error: err.message || 'Internal server error' });
    }
};
exports.login = login;
const requestOTP = async (req, res) => {
    try {
        const { phone } = req.body;
        if (!phone) {
            return res.status(400).json({ error: 'Phone number is required.' });
        }
        // Generate a mock 6-digit code
        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
        // In a live system, send this OTP code using Jazz or SMS API.
        // For demo/development purposes, we send it back in response.
        res.status(200).json({
            message: 'OTP sent successfully (Simulated)',
            otpCode,
            note: 'In production, this code is sent to the mobile device via SMS gateway.'
        });
    }
    catch (err) {
        res.status(500).json({ error: err.message || 'Internal server error' });
    }
};
exports.requestOTP = requestOTP;
const verifyOTP = async (req, res) => {
    try {
        const { phone, code } = req.body;
        if (!phone || !code) {
            return res.status(400).json({ error: 'Phone number and OTP code are required.' });
        }
        // Always succeed with mock verification codes or code '123456' for ease of manual verification
        if (code === '123456' || code.length === 6) {
            let user = await db_1.prisma.user.findUnique({
                where: { phone },
                include: { profile: true },
            });
            if (!user) {
                // Auto-create a guest buyer profile if the phone number doesn't exist
                const passwordHash = await bcrypt_1.default.hash('GuestPass123!', 10);
                user = await db_1.prisma.user.create({
                    data: {
                        phone,
                        passwordHash,
                        role: 'BUYER',
                        profile: {
                            create: {
                                fullName: `User ${phone.slice(-4)}`,
                            },
                        },
                    },
                    include: { profile: true },
                });
            }
            const token = jsonwebtoken_1.default.sign({ userId: user.id, role: user.role, phone: user.phone }, JWT_SECRET, { expiresIn: '7d' });
            return res.status(200).json({
                message: 'OTP verified successfully',
                token,
                user: {
                    id: user.id,
                    phone: user.phone,
                    email: user.email,
                    role: user.role,
                    fullName: user.profile?.fullName,
                },
            });
        }
        res.status(400).json({ error: 'Invalid OTP code.' });
    }
    catch (err) {
        res.status(500).json({ error: err.message || 'Internal server error' });
    }
};
exports.verifyOTP = verifyOTP;
const googleSignIn = async (req, res) => {
    try {
        const { email, googleToken, fullName, phone } = req.body;
        if (!email || !googleToken) {
            return res.status(400).json({ error: 'Email and Google authentication token are required.' });
        }
        // Mock verification of googleToken
        const resolvedPhone = phone || `+92${Math.floor(3000000000 + Math.random() * 900000000)}`;
        let user = await db_1.prisma.user.findUnique({
            where: { phone: resolvedPhone },
            include: { profile: true },
        });
        if (!user) {
            user = await db_1.prisma.user.findFirst({
                where: { email },
                include: { profile: true },
            });
        }
        if (!user) {
            const passwordHash = await bcrypt_1.default.hash(Math.random().toString(36), 10);
            user = await db_1.prisma.user.create({
                data: {
                    email,
                    phone: resolvedPhone,
                    passwordHash,
                    role: 'BUYER',
                    profile: {
                        create: {
                            fullName: fullName || email.split('@')[0],
                        },
                    },
                },
                include: { profile: true },
            });
        }
        const token = jsonwebtoken_1.default.sign({ userId: user.id, role: user.role, phone: user.phone }, JWT_SECRET, { expiresIn: '7d' });
        res.status(200).json({
            message: 'Google Sign-In successful',
            token,
            user: {
                id: user.id,
                phone: user.phone,
                email: user.email,
                role: user.role,
                fullName: user.profile?.fullName,
            },
        });
    }
    catch (err) {
        res.status(500).json({ error: err.message || 'Internal server error' });
    }
};
exports.googleSignIn = googleSignIn;
const getProfile = async (req, res) => {
    try {
        const userId = req.user?.userId;
        const user = await db_1.prisma.user.findUnique({
            where: { id: userId },
            include: {
                profile: true,
                verification: true,
            },
        });
        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }
        res.status(200).json({
            user: {
                id: user.id,
                phone: user.phone,
                email: user.email,
                role: user.role,
                createdAt: user.createdAt,
                profile: user.profile,
                verification: user.verification,
            },
        });
    }
    catch (err) {
        res.status(500).json({ error: err.message || 'Internal server error' });
    }
};
exports.getProfile = getProfile;
const updateProfile = async (req, res) => {
    try {
        const userId = req.user?.userId;
        const { fullName, avatarUrl, bio, agencyName, agencyLicense, whatsappNumber } = req.body;
        const updatedProfile = await db_1.prisma.profile.update({
            where: { userId },
            data: {
                fullName,
                avatarUrl,
                bio,
                agencyName,
                agencyLicense,
                whatsappNumber,
            },
        });
        res.status(200).json({
            message: 'Profile updated successfully',
            profile: updatedProfile,
        });
    }
    catch (err) {
        res.status(500).json({ error: err.message || 'Internal server error' });
    }
};
exports.updateProfile = updateProfile;
const submitVerification = async (req, res) => {
    try {
        const userId = req.user?.userId;
        const { cnicNumber, cnicFrontUrl, cnicBackUrl, documentUrl } = req.body;
        if (!cnicNumber || !cnicFrontUrl || !cnicBackUrl || !documentUrl) {
            return res.status(400).json({ error: 'CNIC details and property ownership document are required.' });
        }
        const verification = await db_1.prisma.verification.upsert({
            where: { userId },
            update: {
                cnicNumber,
                cnicFrontUrl,
                cnicBackUrl,
                documentUrl,
                status: 'PENDING',
                rejectionReason: null,
            },
            create: {
                userId: userId,
                cnicNumber,
                cnicFrontUrl,
                cnicBackUrl,
                documentUrl,
                status: 'PENDING',
            },
        });
        res.status(200).json({
            message: 'Verification documents submitted successfully.',
            verification,
        });
    }
    catch (err) {
        res.status(500).json({ error: err.message || 'Internal server error' });
    }
};
exports.submitVerification = submitVerification;
