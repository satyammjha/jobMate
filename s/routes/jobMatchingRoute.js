import express from 'express';
import { jobMatchingFunction } from '../controllers/jobMatchingController.js';

const router = express.Router();

router.post('/', jobMatchingFunction);

export default router;