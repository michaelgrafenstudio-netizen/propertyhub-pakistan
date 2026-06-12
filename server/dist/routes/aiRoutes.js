"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const aiController_1 = require("../controllers/aiController");
const router = (0, express_1.Router)();
router.post('/valuation', aiController_1.estimateValuation);
router.post('/description', aiController_1.generateDescription);
router.post('/fraud-check', aiController_1.fraudCheck);
exports.default = router;
