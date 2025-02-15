import crypto from "crypto";

const generateReferralCode = (length = 8) => {
    return crypto.randomBytes(length)
        .toString('hex')
        .substring(0, length)
        .toUpperCase();
};

export default generateReferralCode;