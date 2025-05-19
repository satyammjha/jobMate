import { NewsLetter } from "../models/User.js";

const addToNewsLetter = async (req, res) => {
    const { email } = req.body;
    try {
        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        const existingEmail = await NewsLetter.findOne({ email });

        if (existingEmail) {
            if (existingEmail.isSubscribed) {
                return res.status(400).json({
                    message: "This email is already subscribed for receiving newsletter",
                    email,
                    isSubscribed: true,
                    subscribedAt: existingEmail.subscribedAt
                });
            } else {
                // Re-subscribe
                existingEmail.isSubscribed = true;
                existingEmail.subscribedAt = new Date();
                existingEmail.unsubscribedAt = undefined;
                await existingEmail.save();

                return res.status(200).json({
                    message: "You have successfully re-subscribed to our newsletter!",
                    email
                });
            }
        }

        // New subscription
        await NewsLetter.create({ email, isSubscribed: true, subscribedAt: new Date() });

        return res.status(200).json({
            message: "You have successfully subscribed to our newsletter!",
            email
        });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};


const unSubscribeToNewsLetter = async (req, res) => {
    const { email } = req.body;
    try {
        if (!email) {
            res.status(400).json({ message: "Email is required" })
        }
        else {
            await NewsLetter.findOneAndUpdate({ email }, { isSubscribed: false, unsubscribedAt: new Date() });
            res.status(200).json({ message: "You have successfully unsubscribed from our newsletter!" })
        }
    }
    catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message })
    }
}

export default addToNewsLetter;
export { unSubscribeToNewsLetter };