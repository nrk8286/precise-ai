import { Connection, PublicKey } from '@solana/web3.js';
import {Metadata} from "@metaplex-foundation/mpl-token-metadata";
const TOKEN_METADATA_PROGRAM_ID = new PublicKey(
    'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s' // Metadata program ID on Solana
);

const rpcUrl = process.env.NEXT_PUBLIC_HELIUS_URL;

export async function getTokenName(mintAddress: string): Promise<{ name: string; symbol: string, image: string }> {
    try {
        if (!rpcUrl) {
            throw new Error("RPC URL is not provided");
        }

        // Connect to the Solana cluster
        const connection = new Connection(rpcUrl);

        // Get the mint public key
        const mintPublicKey = new PublicKey(mintAddress);

        // Derive the metadata PDA
        const [metadataPDA] = await PublicKey.findProgramAddress(
            [
                Buffer.from('metadata'),
                TOKEN_METADATA_PROGRAM_ID.toBuffer(),
                mintPublicKey.toBuffer(),
            ],
            TOKEN_METADATA_PROGRAM_ID
        );

        // Fetch the metadata account
        const accountInfo = await connection.getAccountInfo(metadataPDA);
        if (!accountInfo) {
            throw new Error("Metadata account not found for this mint address.");
        }

        // Decode the metadata using Metaplex's Metadata class
        const deserialized = Metadata.deserialize(accountInfo.data);
        const metadata = Array.isArray(deserialized) ? deserialized[0] : deserialized; // Handle array or single object

        // Ensure metadata is valid
        if (!metadata || !metadata.data) {
            throw new Error("Invalid metadata structure.");
        }

        // Clean up fields to remove padding
        const name = metadata.data.name.replace(/\0/g, '').trim();
        const symbol = metadata.data.symbol.replace(/\0/g, '').trim();
        const uri = metadata.data.uri.replace(/\0/g, '').trim();

        return { name, symbol, image: uri };
    } catch (error) {
        console.error("Error fetching token metadata:", error);
        console.log("fallback to Palms name")
        return {name: "Token", symbol: mintAddress, image: ""}
    }
}