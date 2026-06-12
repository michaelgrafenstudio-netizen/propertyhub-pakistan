"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const adminController_1 = require("../controllers/adminController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Restrict all these endpoints to ADMIN role only
router.get('/stats', auth_1.authenticateJWT, (0, auth_1.authorizeRoles)(['ADMIN']), adminController_1.getDashboardStats);
router.get('/properties/pending', auth_1.authenticateJWT, (0, auth_1.authorizeRoles)(['ADMIN']), adminController_1.getPendingListings);
router.put('/properties/:propertyId/status', auth_1.authenticateJWT, (0, auth_1.authorizeRoles)(['ADMIN']), adminController_1.approveListing);
router.get('/verifications/pending', auth_1.authenticateJWT, (0, auth_1.authorizeRoles)(['ADMIN']), adminController_1.getPendingVerifications);
router.put('/verifications/:id/status', auth_1.authenticateJWT, (0, auth_1.authorizeRoles)(['ADMIN']), adminController_1.approveUserVerification);
exports.default = router;
