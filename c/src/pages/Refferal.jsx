"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "../components/ui/card";

import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "../components/ui/table";
import RefferalMessage from "../customComponents/Refferal/RefferalMessage";
import UserRefferal from "../customComponents/Refferal/UserRefferal";
import axios from "axios";

export default function ReferralTracker() {
  const [leaderBoard, setLeaderBoard] = useState([]);

  useEffect(() => {
    const fetchReferralList = async () => {
      try {
        const response = await axios.get("http://localhost:5000/data/fetchRefferalList");
        if (response.status >= 200 && response.status < 300) {
          const data = response.data.referralCounts;

          console.log("API Response:", data);
          if (!Array.isArray(data)) {
            throw new Error("Fetched data is not an array");
          }

          const formattedData = data.map((user, index) => ({
            id: user._id || index,
            rank: index + 1,
            name: user.name || "Unknown",
            email: user.email || "No email",
            points: user.referralCount || 0,
          }));

          setLeaderBoard(formattedData);
          console.log
        } else {
          throw new Error(`Failed to fetch referral list: ${response.statusText}`);
        }
      } catch (error) {
        console.error("Error fetching referral list:", error);
      }
    };

    fetchReferralList();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <RefferalMessage />
      <div className="grid lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">🏆 Leaderboard</CardTitle>
            <CardDescription>
              Top performers based on successful referrals
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Rank</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead className="text-right">Points</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leaderBoard.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell>#{entry.rank}</TableCell>
                    <TableCell>{entry.name}</TableCell>
                    <TableCell>{entry.email}</TableCell>
                    <TableCell className="text-right">{entry.points}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <UserRefferal />
      </div>
    </div>
  );
}