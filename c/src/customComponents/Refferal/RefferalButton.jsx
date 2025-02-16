import React, { useState } from 'react';
import { Button } from '../../components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "../../components/ui/dialog";
import { MessageCircle, Linkedin, Twitter, ClipboardCheck, Share2 } from 'lucide-react';

const ReferralButton = ({ referralCode }) => {
    const [isCopied, setIsCopied] = useState(false);
    const referralLink = `https://example.com/ref/${referralCode}`;
    const message = `🚀 Get 50 AI credits instantly! Join using my referral link and start exploring powerful AI tools today: ${referralLink}`;

    const handleShare = (platform) => {
        let url = '';
        switch (platform) {
            case 'whatsapp':
                url = `https://wa.me/?text=${encodeURIComponent(message)}`;
                break;
            case 'twitter':
                url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}`;
                break;
            case 'linkedin':
                url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(referralLink)}`;
                break;
            default:
                return;
        }
        window.open(url, '_blank');
    };

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(referralLink);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy text:', err);
        }
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                    <Share2 className="h-5 w-5" /> Refer & Earn
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Refer & Earn 50 AI Credits</DialogTitle>
                </DialogHeader>
                <p className="text-sm text-gray-600">
                    Invite your friends and both of you get <strong>50 AI credits</strong>! 🚀
                </p>
                <div className="grid grid-cols-2 gap-4 mt-4">
                    <Button variant="outline" onClick={() => handleShare('whatsapp')}>
                        <MessageCircle className="mr-2 h-4 w-4" /> WhatsApp
                    </Button>
                    <Button variant="outline" onClick={() => handleShare('linkedin')}>
                        <Linkedin className="mr-2 h-4 w-4" /> LinkedIn
                    </Button>
                    <Button variant="outline" onClick={() => handleShare('twitter')}>
                        <Twitter className="mr-2 h-4 w-4" /> Twitter/X
                    </Button>
                    <Button variant="outline" onClick={handleCopyLink}>
                        <ClipboardCheck className="mr-2 h-4 w-4" /> {isCopied ? 'Copied!' : 'Copy Link'}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ReferralButton;
