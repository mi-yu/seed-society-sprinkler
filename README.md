# Automatic watering for Seed Society

https://seedsociety.xyz/

## Setup
1. Install dependencies
```
yarn install
```
2. Make env file
```
cp .env.example .env
```
`WALLET_KEY` should be your base58 encoded private key. If you are exporting private key from a browser wallet, transfer all assets/NFTs to another wallet first before exporting.
You can find your gardener pubkey by inspecting
3. Run
```
yarn start
```
