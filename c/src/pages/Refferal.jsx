"use client";
import { Helmet } from "react-helmet-async";
import RefferalMessage from "../customComponents/Refferal/RefferalMessage";
import UserRefferal from "../customComponents/Refferal/UserRefferal";
import ReferralLeaderBoard from "../customComponents/Leaderboard";

export default function ReferralTracker() {
  return (
    <>
      <Helmet>
        <title>Job Referral Tracker | Zobly</title>
        <meta name="description" content="Track your job referrals and earn rewards with Zobly. Stay updated with the leaderboard and manage your referrals easily." />
        <meta name="keywords" content="job referrals, referral tracker, job opportunities, Zobly referrals, earn rewards" />
        <meta name="author" content="Zobly" />
        <meta property="og:title" content="Job Referral Tracker | Zobly" />
        <meta property="og:description" content="Track your job referrals and earn rewards with Zobly. Stay updated with the leaderboard and manage your referrals easily." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.zobly.com/referral-tracker" />
        <meta property="og:image" content="https://www.zobly.com/assets/referral-banner.png" />
      </Helmet>
      
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-6 md:gap-8">
          <RefferalMessage className="mb-8" />
          <ReferralLeaderBoard />
        </div>
        <UserRefferal />
      </div>
    </>
  );
}