import { Router } from 'express';
import { notifyUser,toggleNotifyExpiringJobs } from '../controllers/notifyUser.js'; 
const emailRouter = Router();
emailRouter.get('/expjobs', notifyUser);
emailRouter.put("/toggle-expiring-jobs", toggleNotifyExpiringJobs);
export default emailRouter;