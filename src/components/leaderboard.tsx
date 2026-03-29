
'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Trophy, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const LEADERBOARD_KEY = 'wineWiseLeaderboard';

type LeaderboardEntry = { rank: number, name: string, score: number };

export function Leaderboard() {
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    try {
      const savedData = localStorage.getItem(LEADERBOARD_KEY);
      if (savedData) {
        setLeaderboardData(JSON.parse(savedData));
      }
    } catch (e) {
      console.error("Failed to load leaderboard from localStorage:", e);
      setLeaderboardData([]);
    }
  }, []);

  const clearLeaderboard = () => {
    try {
      localStorage.removeItem(LEADERBOARD_KEY);
      setLeaderboardData([]);
    } catch (e) {
      console.error("Failed to clear leaderboard in localStorage:", e);
    }
  };
  
  return (
    <Card className="shadow-lg">
      <CardHeader className="text-center">
        <div className="mx-auto bg-primary/10 rounded-full p-3 w-fit mb-2">
            <Trophy className="h-8 w-8 text-primary" />
        </div>
        <CardTitle className="text-2xl font-headline">Leaderboard</CardTitle>
        <CardDescription>Top Players of All Time</CardDescription>
      </CardHeader>
      <CardContent>
        {leaderboardData.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">Rank</TableHead>
                <TableHead>Player</TableHead>
                <TableHead className="text-right">Score</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leaderboardData.map((player) => (
                <TableRow key={player.rank}>
                  <TableCell className="font-medium">{player.rank}</TableCell>
                  <TableCell>{player.name}</TableCell>
                  <TableCell className="text-right">{player.score}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <p className="text-center text-muted-foreground py-8">The leaderboard is empty. Play a game to get on the board!</p>
        )}
      </CardContent>
      {leaderboardData.length > 0 && (
        <CardFooter className="justify-end">
          <Button variant="outline" size="sm" onClick={clearLeaderboard}>
            <Trash2 className="mr-2 h-4 w-4" />
            Clear Leaderboard
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
