import { Router } from 'express';
import { notifyUser, toggleNotifyExpiringJobs } from '../controllers/notifyUser.js';
const emailRouter = Router();

emailRouter.post('/expjobs', notifyUser);

emailRouter.put("/toggle-expiring-jobs", async (req, res) => {
    const { email, action } = req.body;
    await toggleNotifyExpiringJobs({ email, action }, res);
});
export default emailRouter;