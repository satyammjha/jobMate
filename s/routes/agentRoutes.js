import express from 'express';
import { geminiAgentController } from '../controllers/geminiAgentController.js';
import { jobSearchController } from '../controllers/agentControllers/jobSearchController.js';

const router = express.Router();
router.post('/gemini', geminiAgentController);
export default router;