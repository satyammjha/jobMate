import express from 'express';
import { geminiAgentController } from '../controllers/geminiAgentController.js';

const router = express.Router();
router.post('/gemini', geminiAgentController);
export default router;