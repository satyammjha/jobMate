"use client";

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "../components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "../components/ui/table";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import { AlertCircleIcon, PlusCircleIcon } from "lucide-react";
import RefferalMessage from '../customComponents/Refferal/RefferalMessage';
import UserRefferal from '../customComponents/Refferal/UserRefferal';

export default function ReferralTracker() {
  const [referrals, setReferrals] = useState([]);


  const [leaderboard] = useState([
    { id: "1", name: "John Doe", email: "john@example.com", points: 1500, rank: 1 },
    { id: "2", name: "Jane Smith", email: "jane@example.com", points: 1200, rank: 2 },
    { id: "3", name: "Bob Johnson", email: "bob@example.com", points: 900, rank: 3 },
  ]);


  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid lg:grid-cols-2 gap-8">
        <RefferalMessage />
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              🏆 Leaderboard
            </CardTitle>
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
                {leaderboard.map((entry) => (
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
     <UserRefferal/>
      </div>
    </div>
  );
}