import { PublicKey } from "@solana/web3.js";

export const RPC_URL = process.env.RPC || "https://api.mainnet-beta.solana.com";
export const SEED_SOCIETY_PROGRAM_ID = new PublicKey(
  "tuberzVVow3N7VTNHmwmoaJ88BM8bNVJNnhTiSYYpRC"
);
export const TUBER_METADATA_AUTHORITY = new PublicKey(
  "7TEJqD7gXi7FBZ9uCc8R5kmbrkmi5aUvmDNmHqJxUkys"
);
export const TUBER_FREEZE_AUTHORITY = new PublicKey(
  "FRc1vu7f6boyh4RFvAdNowtojVmr6h5ELFbdXhWc6PoX"
);
export const WATERS_PER_DAY = 5;

// 8 days, in milliseconds
export const DEAD_THRESHOLD = 7.5 * 24 * 60 * 60 * 1000;

// base58 encoded
export const WALLET_KEY = process.env.WALLET_KEY || "";
