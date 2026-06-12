"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSubscriptions = exports.createSubscription = exports.processPayment = void 0;
const db_1 = require("../config/db");
const processPayment = async (req, res) => {
    try {
        const userId = req.user?.userId;
        const { amount, method, description } = req.body;
        if (!amount || !method) {
            return res.status(400).json({ error: 'Amount and payment method are required.' });
        }
        if (!['JAZZCASH', 'EASYPAISA', 'CREDIT_CARD'].includes(method)) {
            return res.status(400).json({ error: 'Invalid payment method. Choose JAZZCASH, EASYPAISA, or CREDIT_CARD.' });
        }
        // Mock Gateway response processing
        const gatewayReference = 'TXN-' + Math.floor(1000000000 + Math.random() * 9000000000).toString();
        // Create record in database
        const payment = await db_1.prisma.payment.create({
            data: {
                userId: userId,
                amount,
                method,
                status: 'SUCCESS', // Mocking instant success
                gatewayReference,
                description: description || 'Payment received successfully.',
            },
        });
        res.status(200).json({
            message: 'Payment completed successfully (Simulated).',
            payment,
        });
    }
    catch (err) {
        res.status(500).json({ error: err.message || 'Internal server error' });
    }
};
exports.processPayment = processPayment;
const createSubscription = async (req, res) => {
    try {
        const userId = req.user?.userId;
        const { planName, amount, durationDays } = req.body;
        if (!planName || !amount || !durationDays) {
            return res.status(400).json({ error: 'Plan name, amount, and duration in days are required.' });
        }
        const startDate = new Date();
        const endDate = new Date();
        endDate.setDate(startDate.getDate() + parseInt(durationDays));
        const subscription = await db_1.prisma.subscription.create({
            data: {
                userId: userId,
                planName,
                amount,
                startDate,
                endDate,
                isActive: true,
            },
        });
        res.status(201).json({
            message: 'Subscription plan activated successfully.',
            subscription,
        });
    }
    catch (err) {
        res.status(500).json({ error: err.message || 'Internal server error' });
    }
};
exports.createSubscription = createSubscription;
const getSubscriptions = async (req, res) => {
    try {
        const userId = req.user?.userId;
        const subscriptions = await db_1.prisma.subscription.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });
        res.status(200).json({ subscriptions });
    }
    catch (err) {
        res.status(500).json({ error: err.message || 'Internal server error' });
    }
};
exports.getSubscriptions = getSubscriptions;
