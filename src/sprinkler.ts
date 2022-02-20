import { Program, Provider, Wallet } from "@project-serum/anchor";
import {
  AccountInfo,
  Connection,
  Keypair,
  PublicKey,
  SystemProgram,
} from "@solana/web3.js";
import { getAssociatedTokenAddress, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import {
  Metadata,
  MetadataProgram,
} from "@metaplex-foundation/mpl-token-metadata";
import base58 from "bs58";
import { logger } from "./logger";
import {
  DEAD_THRESHOLD,
  GARDENER,
  OWNED_TUBER,
  RPC_URL,
  SEED_SOCIETY_PROGRAM_ID,
  TUBER_FREEZE_AUTHORITY,
  TUBER_METADATA_AUTHORITY,
  WALLET_KEY,
} from "./constants";
import { Gardener, IDL, Plant, SeedSociety } from "./idl";

export class Sprinkler {
  private program: Program<SeedSociety>;
  private gardener: Promise<Gardener>;

  constructor() {
    const connection = new Connection(RPC_URL);
    const walletKey = WALLET_KEY ? base58.decode(WALLET_KEY) : null;
    this.program = new Program(
      IDL,
      SEED_SOCIETY_PROGRAM_ID,
      walletKey
        ? new Provider(
            connection,
            new Wallet(Keypair.fromSecretKey(walletKey)),
            Provider.defaultOptions()
          )
        : undefined
    );
    this.gardener = this.program.account.gardener.fetch(
      GARDENER
    ) as Promise<any>;
  }

  async process() {
    try {
      // Sort by oldest waterTimeout, then level
      const plants = (await this.getPlants()).sort((a, b) => {
        if (a.waterTimeout.toNumber() !== b.waterTimeout.toNumber()) {
          return a?.waterTimeout.toNumber() - b?.waterTimeout.toNumber();
        }
        return a.level - b.level;
      });
      const gardener = await this.gardener;

      logger.info(`Fetched ${plants.length} plants`);

      const now = new Date();
      const threshold = now.getTime() - DEAD_THRESHOLD;
      const waterablePlants = plants.filter((p) => {
        const nextWater = new Date(p.waterTimeout.toNumber() * 1000);
        // check nextWater is in past and plant isn't dead
        return (
          now.getTime() >= nextWater.getTime() &&
          nextWater.getTime() > threshold
        );
      });
      logger.info(`Found ${waterablePlants.length} waterable plants`);

      const remainingWaters = Math.max(5 - gardener.wateredInTimeframe, 0);
      logger.info(`Remaining waters: ${remainingWaters}`);

      for (const batch of inBatches(
        waterablePlants.slice(0, remainingWaters),
        30
      )) {
        await Promise.allSettled(batch.map((p) => this.waterPlant(p)));
      }
    } catch (e) {
      logger.error(e);
    }
  }

  private async waterPlant(plant: Plant) {
    const [gardener, tuberATA, tuberMetadata, plantATA, plantMetadata] =
      await Promise.all([
        this.gardener,
        getAssociatedTokenAddress(
          OWNED_TUBER,
          this.program.provider.wallet.publicKey
        ),
        Metadata.getPDA(OWNED_TUBER),
        getAssociatedTokenAddress(plant.mint, plant.owner),
        Metadata.getPDA(plant.mint),
      ]);
    logger.info(`watering plant ${plant.pubkey.toBase58()}`);

    try {
      const tx = await this.program.rpc.water(
        plant.name as unknown as number[],
        gardener.bump,
        {
          accounts: {
            plant: plant.pubkey,
            gardener: GARDENER,
            ownedPlantMint: OWNED_TUBER,
            ownedPlantToken: tuberATA,
            ownedMetadata: tuberMetadata,
            plantMint: plant.mint,
            plantToken: plantATA,
            plantMetadata,
            freezeAuthority: TUBER_FREEZE_AUTHORITY,
            metadataAuthority: TUBER_METADATA_AUTHORITY,
            authority: gardener.authority,
            tokenProgram: TOKEN_PROGRAM_ID,
            systemProgram: SystemProgram.programId,
            metadataProgram: MetadataProgram.PUBKEY,
          },
        }
      );
      await this.program.provider.connection.confirmTransaction(tx);
      logger.info(`successfully watered plant ${plant.pubkey.toBase58()}`);
    } catch (e) {
      logger.error(`failed watering plant ${plant.pubkey.toBase58()}: ${e}`);
    }
  }

  private async getPlants() {
    try {
      const plantAccounts =
        await this.program.provider.connection.getProgramAccounts(
          SEED_SOCIETY_PROGRAM_ID,
          {
            filters: [
              {
                dataSize: 66,
              },
              {
                memcmp: {
                  bytes: base58.encode(
                    Buffer.from([
                      0xdd, 0xcf, 0x17, 0x96, 0x94, 0x36, 0xe3, 0x67,
                    ])
                  ),
                  offset: 0,
                },
              },
            ],
          }
        );
      const plants = [];
      for (const batch of inBatches(plantAccounts, 30)) {
        const results = await Promise.allSettled(
          batch.map((p) => this.decodePlant(p))
        );
        for (const res of results) {
          if (res.status === "fulfilled") {
            plants.push(res.value!);
          }
        }
      }
      return plants;
    } catch (e) {
      logger.error(e);
      return [];
    }
  }

  private async decodePlant(p: {
    pubkey: PublicKey;
    account: AccountInfo<Buffer>;
  }): Promise<Plant | undefined> {
    try {
      const plant = this.program.coder.accounts.decode("plant", p.account.data);
      const holderRes =
        await this.program.provider.connection.getTokenLargestAccounts(
          plant.mint
        );
      const currentHolderATA = holderRes.value.find(
        (pair) => pair.uiAmount === 1
      );
      if (!currentHolderATA)
        throw new Error(`No holder found for plant ${plant.mint.toBase58()}`);
      const currentHolder =
        await this.program.provider.connection.getParsedAccountInfo(
          currentHolderATA.address
        );
      if (!currentHolder.value)
        throw new Error(
          `No owner found for plant ${plant.mint.toBase58()} (ata = ${currentHolderATA.address.toBase58()})`
        );

      return {
        ...plant,
        owner: new PublicKey(
          (currentHolder.value.data as any).parsed.info.owner as string
        ),
        pubkey: p.pubkey,
      };
    } catch (e) {
      logger.error(`Failed to decode plant ${p.pubkey.toBase58()}: ${e}`);
    }
  }

  private plantToJSON(p: Plant) {
    const nextWater = new Date(p.waterTimeout.toNumber() * 1000);
    return {
      ...p,
      name: Buffer.from(p.name)
        .filter((b) => b > 0)
        .toString(),
      mint: p.mint.toBase58(),
      owner: p.owner.toBase58(),
      pubkey: p.pubkey.toBase58(),
      waterTimeout: nextWater,
      canWater: new Date().getTime() >= nextWater.getTime(),
    };
  }
}

const inBatches = <T>(items: T[], batchSize: number) => {
  const batches: T[][] = [];
  for (let i = 0; i < items.length; i += batchSize) {
    batches.push(items.slice(i, i + batchSize));
  }
  return batches;
};
