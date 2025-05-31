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

        const emailSubject = `Action Required: ${expiringJobs.length} Job Application${expiringJobs.length > 1 ? 's' : ''} Expiring Soon!`;

        const textContent = `
        Hello,

        This is a reminder that you have ${expiringJobs.length} job application${expiringJobs.length > 1 ? 's' : ''} expiring soon:

        ${expiringJobs.map((job, index) => `
        ${index + 1}. ${job.title} at ${job.company}
           Expiry Date: ${job.expiryDate}
           Application Details: ${process.env.CLIENT_URL}/jobs/${job.id}
        `).join('')}

        Please review and take necessary action before the expiration dates.

        Best regards,
        Your Job Tracker Team

        PS: You can manage notification preferences in your account settings.
        `.replace(/\n\s+/g, '\n');

        const htmlContent = `
        <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background-color: #f8f9fa; padding: 30px; border-radius: 10px;">
                <h1 style="color: #2c3e50; margin-bottom: 25px;">⏳ Job Application Expiry Alert</h1>
                
                <p style="font-size: 16px; color: #4a5568;">
                    You have <strong>${expiringJobs.length}</strong> job application${expiringJobs.length > 1 ? 's' : ''} 
                    expiring soon. Here's your summary:
                </p>

                <div style="margin: 25px 0;">
                    ${expiringJobs.map((job, index) => `
                    <div style="padding: 15px; background-color: ${index % 2 === 0 ? '#ffffff' : '#f8f9fa'}; 
                         border-radius: 5px; margin-bottom: 10px;">
                        <h3 style="margin: 0 0 8px 0; color: #2c3e50;">${job.title}</h3>
                        <div style="color: #4a5568;">
                            <p style="margin: 5px 0;">
                                <strong>Company:</strong> ${job.company}<br>
                                <strong>Expires:</strong> ${new Date(job.expiryDate).toLocaleDateString()}<br>
                                <a href="${process.env.CLIENT_URL}/jobs/${job.id}" 
                                   style="color: #4299e1; text-decoration: none;">
                                    View Details →
                                </a>
                            </p>
                        </div>
                    </div>
                    `).join('')}
                </div>

                <div style="text-align: center; margin-top: 30px;">
                    <a href="${process.env.CLIENT_URL}/dashboard" 
                       style="background-color: #4299e1; color: white; padding: 12px 25px; 
                              border-radius: 5px; text-decoration: none; display: inline-block;
                              font-weight: 500;">
                        Review Applications
                    </a>
                </div>

                <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0;
                           color: #718096; font-size: 14px;">
                    <p>Need help? Contact our support team at 
                        <a href="mailto:support@jobtracker.com" style="color: #4299e1;">
                            support@jobtracker.com
                        </a>
                    </p>
                    <p style="margin-bottom: 0;">
                        <a href="${process.env.CLIENT_URL}/notification-settings" 
                           style="color: #4299e1; text-decoration: none;">
                            Manage notification preferences
                        </a>
                    </p>
                </div>
            </div>
        </div>`;

        const mailOptions = {
            from: `Job Tracker <${process.env.EMAIL_ADDRESS}>`,
            to: email,
            subject: emailSubject,
            text: textContent,
            html: htmlContent,
            headers: {
                'X-Priority': '1',
                'X-MSMail-Priority': 'High',
                Importance: 'high'
            }
        };

        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: "Expiring jobs email sent successfully" });

    } catch (error) {
        console.error('Email sending error:', error);
        res.status(500).json({
            message: "Failed to send expiring jobs email",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};





export const toggleNotifyExpiringJobs = async ({ email, action }, res) => {
    console.log("Email:", email, "Action received:", action);

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        if (!action) {
            user.notifyAboutExpiringJobs = !user.notifyAboutExpiringJobs;
        } else if (action === "enable") {
            if (user.notifyAboutExpiringJobs) {
                return res.json({ success: true, message: "Notifications are already enabled." });
            }
            user.notifyAboutExpiringJobs = true;
        } else if (action === "disable") {
            if (!user.notifyAboutExpiringJobs) {
                return res.json({ success: true, message: "Notifications are already disabled." });
            }
            user.notifyAboutExpiringJobs = false;
        } else {
            return res.status(400).json({ success: false, message: "Invalid action. Use 'enable' or 'disable'." });
        }

        await user.save();
        return res.json({
            success: true,
            message: `Job expiry notifications have been ${user.notifyAboutExpiringJobs ? "enabled" : "disabled"}.`,
            notifyAboutExpiringJobs: user.notifyAboutExpiringJobs,
        });

    } catch (error) {
        console.error("Error updating notification setting:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};