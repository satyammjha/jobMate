import User from '../models/User.js';
import { checkExpiringJobs } from '../utility/expiringJobs.js';
import { transporter } from '../utility/transporter.js';

export const notifyUser = async (req, res) => {
    const { email } = req.body;

    try {
        const expiringJobs = await checkExpiringJobs(email);
        if (expiringJobs.length === 0) {
            return res.status(200).json({ message: "No expiring jobs found or notifications disabled." });
        }
        const subject = "Expiring Job Alert";
        const text = `You have ${expiringJobs.length} jobs expiring soon. Check them now!`;
        const html = `<p>You have <strong>${expiringJobs.length}</strong> jobs expiring soon:</p>
                      <ul>${expiringJobs.map(job => `<li>${job.title} at ${job.company} (Expiring: ${job.expiryDate})</li>`).join('')}</ul>`;

        const mailOptions = {
            from: process.env.EMAIL_ADDRESS,
            to: email,
            subject: subject,
            text: text,
            html: html
        };

        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: "Expiring jobs email sent successfully" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to send expiring jobs email" });
    }
};


export const toggleNotifyExpiringJobs = async (req, res) => {
    const { email } = req.body;
    
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        if (typeof user.notifyAboutExpiringJobs === 'undefined') {
            user.notifyAboutExpiringJobs = true;
        } else {
            user.notifyAboutExpiringJobs = !user.notifyAboutExpiringJobs;
        }

        await user.save();

        res.json({
            success: true,
            message: `Notification setting updated successfully!`,
            notifyAboutExpiringJobs: user.notifyAboutExpiringJobs
        });
    } catch (error) {
        console.error("Error updating notification setting:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};
