"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.approveUserVerification = exports.getPendingVerifications = exports.approveListing = exports.getPendingListings = exports.getDashboardStats = void 0;
const db_1 = require("../config/db");
const getDashboardStats = async (req, res) => {
    try {
        const totalUsers = await db_1.prisma.user.count();
        const totalProperties = await db_1.prisma.property.count();
        const activeListings = await db_1.prisma.property.count({ where: { status: 'ACTIVE' } });
        const pendingListings = await db_1.prisma.property.count({ where: { status: 'PENDING_VERIFICATION' } });
        const totalRevenue = await db_1.prisma.payment.aggregate({
            where: { status: 'SUCCESS' },
            _sum: {
                amount: true,
            },
        });
        const pendingVerifications = await db_1.prisma.verification.count({ where: { status: 'PENDING' } });
        res.status(200).json({
            totalUsers,
            totalProperties,
            activeListings,
            pendingListings,
            revenue: totalRevenue._sum.amount || 0,
            pendingVerifications,
            monthlyGrowth: 18.5, // Mock monthly growth percentage
        });
    }
    catch (err) {
        res.status(500).json({ error: err.message || 'Internal server error' });
    }
};
exports.getDashboardStats = getDashboardStats;
const getPendingListings = async (req, res) => {
    try {
        const listings = await db_1.prisma.property.findMany({
            where: { status: 'PENDING_VERIFICATION' },
            include: {
                images: true,
                owner: {
                    include: { profile: true },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
        res.status(200).json({ listings });
    }
    catch (err) {
        res.status(500).json({ error: err.message || 'Internal server error' });
    }
};
exports.getPendingListings = getPendingListings;
const approveListing = async (req, res) => {
    try {
        const { propertyId } = req.params;
        const { status } = req.body; // ACTIVE or REJECTED
        if (!['ACTIVE', 'REJECTED'].includes(status)) {
            return res.status(400).json({ error: 'Status must be ACTIVE or REJECTED.' });
        }
        const updated = await db_1.prisma.property.update({
            where: { id: propertyId },
            data: { status },
        });
        res.status(200).json({
            message: `Property listing status updated to ${status}.`,
            property: updated,
        });
    }
    catch (err) {
        res.status(500).json({ error: err.message || 'Internal server error' });
    }
};
exports.approveListing = approveListing;
const getPendingVerifications = async (req, res) => {
    try {
        const verifications = await db_1.prisma.verification.findMany({
            where: { status: 'PENDING' },
            include: {
                user: {
                    include: { profile: true },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
        res.status(200).json({ verifications });
    }
    catch (err) {
        res.status(500).json({ error: err.message || 'Internal server error' });
    }
};
exports.getPendingVerifications = getPendingVerifications;
const approveUserVerification = async (req, res) => {
    try {
        const { id } = req.params; // Verification ID
        const { status, rejectionReason } = req.body; // VERIFIED or REJECTED
        if (!['VERIFIED', 'REJECTED'].includes(status)) {
            return res.status(400).json({ error: 'Status must be VERIFIED or REJECTED.' });
        }
        const verification = await db_1.prisma.verification.update({
            where: { id },
            data: {
                status,
                rejectionReason: status === 'REJECTED' ? rejectionReason : null,
            },
        });
        if (status === 'VERIFIED') {
            await db_1.prisma.profile.update({
                where: { userId: verification.userId },
                data: { isVerified: true },
            });
        }
        res.status(200).json({
            message: `Verification request ${status.toLowerCase()} successfully.`,
            verification,
        });
    }
    catch (err) {
        res.status(500).json({ error: err.message || 'Internal server error' });
    }
};
exports.approveUserVerification = approveUserVerification;
