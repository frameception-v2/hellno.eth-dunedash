"use client";

import { useEffect, useState } from "react";
import { fetchLeaderboard, type LeaderboardRow, type UserPosition } from "~/lib/dune";
import { Card, CardHeader, CardTitle, CardContent } from "~/components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";
import { Label } from "~/components/ui/label";
import { cn } from "~/lib/utils";

interface LeaderboardProps {
  userAddress?: string;
}

export function DuneLeaderboard({ userAddress }: LeaderboardProps) {
  const [data, setData] = useState<UserPosition | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const result = await fetchLeaderboard(userAddress);
        setData(result);
        setError(null);
      } catch (err) {
        setError("Failed to load leaderboard. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [userAddress]);

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-red-500">Error</CardTitle>
        </CardHeader>
        <CardContent>
          <Label className="text-red-500">{error}</Label>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-6 w-[200px]" />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-4 w-full" />
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Collector Leaderboard</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {data?.leaderboard.length ? (
          data.leaderboard.slice(0, 10).map((row) => (
            <div
              key={row.address}
              className={cn(
                "flex justify-between items-center p-2 rounded",
                row.address.toLowerCase() === userAddress?.toLowerCase() 
                  ? "bg-purple-100 dark:bg-purple-900"
                  : "hover:bg-gray-100 dark:hover:bg-gray-800"
              )}
            >
              <div className="flex items-center space-x-2">
                <span className="font-medium">#{row.rank}</span>
                <Label>{row.username || truncateAddress(row.address)}</Label>
              </div>
              <Label>{row.total_score.toLocaleString()} pts</Label>
            </div>
          ))
        ) : (
          <Label className="text-gray-500">No leaderboard data available</Label>
        )}
        
        {data?.currentUserRank !== undefined && (
          <div className="mt-4 pt-2 border-t border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center">
              <Label>Your Position:</Label>
              <Label className="font-semibold text-purple-600 dark:text-purple-400">
                #{data.currentUserRank}
              </Label>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function truncateAddress(address: string) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}
