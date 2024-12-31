import axios from "axios";
import {FeaturedToken} from "@/types";

export async function fetchTopSolanaTokens(): Promise<FeaturedToken[]> {
    try {
        const response = await axios.get(
            "https://api.coingecko.com/api/v3/coins/markets",
            {
                params: {
                    vs_currency: "usd",
                    order: "volume_desc",
                    per_page: 100, // Fetch a larger pool to filter later
                    page: 1,
                    sparkline: false,
                    category: "solana-ecosystem", // Filter for Solana ecosystem
                },
            }
        );

        // Filter out tokens with market cap > 1 billion
        return response.data
            .filter((token: { market_cap: number; symbol: string }) => token.market_cap <= 1_000_000_000 && token.symbol !== "sol" && token.symbol !== "jlp")
            .map((token: { name: string; symbol: string; current_price: number; market_cap: number; total_volume: number; image: string; price_change_percentage_24h: number; ath_change_percentage: number; }) => ({
                name: token.name,
                symbol: token.symbol,
                price: token.current_price,
                volume: token.total_volume,
                marketCap: token.market_cap,
                image: token.image,
                change24h: token.price_change_percentage_24h,
                athChange: token.ath_change_percentage
            }));
    } catch (error) {
        console.error("Error fetching Solana tokens:", error);
        return [];
    }
}
