import { QueryParameter, DuneClient } from "@duneanalytics/client-sdk";
import { DUNE_API_KEY } from "~/lib/constants";

// Initialize Dune client with API key
export const duneClient = new DuneClient(DUNE_API_KEY ?? "");

// Type definitions for leaderboard data
export interface LeaderboardRow {
  rank: number;
  username: string;
  address: string;
  total_score: number;
  recent_activity: Date;
}

export interface UserPosition {
  currentUserRank?: number;
  leaderboard: LeaderboardRow[];
}

// Cache results for 5 minutes
const CACHE_TTL = 300000;

// Cache storage
let cache: {
  data: UserPosition | null;
  timestamp: number;
} = { data: null, timestamp: 0 };

export async function fetchLeaderboard(userAddress?: string): Promise<UserPosition> {
  // Return cached data if still valid
  if (cache.data && Date.now() - cache.timestamp < CACHE_TTL) {
    return cache.data;
  }

  try {
    // Run the Dune query
    const executionResult = await duneClient.runQuery({
      queryId: 4666478,
      query_parameters: [
        QueryParameter.text("userAddress", userAddress || "")
      ]
    });

    // Process the query results
    const rows = executionResult.result?.rows as LeaderboardRow[];
    if (!rows?.length) return { leaderboard: [] };

    // Find current user's position if address provided
    let currentRank: number | undefined;
    if (userAddress) {
      const normalizedAddress = userAddress.toLowerCase();
      currentRank = rows.findIndex(row => 
        row.address.toLowerCase() === normalizedAddress
      ) + 1; // Ranks are 1-based
    }

    // Update cache
    cache = {
      data: { currentUserRank: currentRank, leaderboard: rows },
      timestamp: Date.now()
    };

    return cache.data;
  } catch (error) {
    console.error("Dune query failed:", error);
    throw new Error("Failed to fetch leaderboard data");
  }
}
