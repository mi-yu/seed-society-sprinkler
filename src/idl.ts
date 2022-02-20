import { BN } from "@project-serum/anchor";
import { PublicKey } from "@solana/web3.js";

export type SeedSociety = {
  version: "0.1.0";
  name: "seed_society";
  instructions: [
    {
      name: "init";
      accounts: [
        {
          name: "plant";
          isMut: true;
          isSigner: false;
        },
        {
          name: "plantMint";
          isMut: false;
          isSigner: false;
        },
        {
          name: "plantToken";
          isMut: false;
          isSigner: false;
        },
        {
          name: "plantMetadata";
          isMut: false;
          isSigner: false;
        },
        {
          name: "authority";
          isMut: true;
          isSigner: true;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: "plantName";
          type: {
            array: ["u8", 12];
          };
        },
        {
          name: "plantBump";
          type: "u8";
        }
      ];
    },
    {
      name: "water";
      accounts: [
        {
          name: "plant";
          isMut: true;
          isSigner: false;
        },
        {
          name: "gardener";
          isMut: true;
          isSigner: false;
        },
        {
          name: "ownedPlantMint";
          isMut: false;
          isSigner: false;
        },
        {
          name: "ownedPlantToken";
          isMut: false;
          isSigner: false;
        },
        {
          name: "ownedMetadata";
          isMut: false;
          isSigner: false;
        },
        {
          name: "plantMint";
          isMut: false;
          isSigner: false;
        },
        {
          name: "plantToken";
          isMut: true;
          isSigner: false;
        },
        {
          name: "plantMetadata";
          isMut: true;
          isSigner: false;
        },
        {
          name: "freezeAuthority";
          isMut: false;
          isSigner: false;
        },
        {
          name: "metadataAuthority";
          isMut: false;
          isSigner: false;
        },
        {
          name: "authority";
          isMut: true;
          isSigner: true;
        },
        {
          name: "tokenProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "metadataProgram";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: "plantName";
          type: {
            array: ["u8", 12];
          };
        },
        {
          name: "gardenerBump";
          type: "u8";
        }
      ];
    },
    {
      name: "checkDead";
      accounts: [
        {
          name: "plant";
          isMut: false;
          isSigner: false;
        },
        {
          name: "authority";
          isMut: true;
          isSigner: true;
        }
      ];
      args: [];
    },
    {
      name: "closePlantAccountAdmin";
      accounts: [
        {
          name: "plant";
          isMut: true;
          isSigner: false;
        },
        {
          name: "plantMetadata";
          isMut: false;
          isSigner: false;
        },
        {
          name: "authority";
          isMut: true;
          isSigner: true;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: "plantName";
          type: {
            array: ["u8", 12];
          };
        }
      ];
    },
    {
      name: "closeGardenerAccountAdmin";
      accounts: [
        {
          name: "gardener";
          isMut: true;
          isSigner: false;
        },
        {
          name: "authority";
          isMut: true;
          isSigner: true;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: "owner";
          type: "publicKey";
        },
        {
          name: "bump";
          type: "u8";
        }
      ];
    },
    {
      name: "nukeMetadataAdmin";
      accounts: [
        {
          name: "metadataAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "authority";
          isMut: true;
          isSigner: true;
        },
        {
          name: "metadataAuthority";
          isMut: false;
          isSigner: false;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "metadataProgram";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [];
    }
  ];
  accounts: [
    {
      name: "plant";
      type: {
        kind: "struct";
        fields: [
          {
            name: "name";
            type: {
              array: ["u8", 12];
            };
          },
          {
            name: "mint";
            type: "publicKey";
          },
          {
            name: "watered";
            type: "u32";
          },
          {
            name: "waterTimeout";
            type: "i64";
          },
          {
            name: "level";
            type: "u8";
          },
          {
            name: "bump";
            type: "u8";
          }
        ];
      };
    },
    {
      name: "gardener";
      type: {
        kind: "struct";
        fields: [
          {
            name: "wateredOthers";
            type: "u32";
          },
          {
            name: "watered";
            type: "u32";
          },
          {
            name: "wateredInTimeframe";
            type: "u32";
          },
          {
            name: "waterTimeout";
            type: "i64";
          },
          {
            name: "authority";
            type: "publicKey";
          },
          {
            name: "bump";
            type: "u8";
          },
          {
            name: "initialized";
            type: "bool";
          }
        ];
      };
    }
  ];
  errors: [
    {
      code: 6000;
      name: "TestError";
      msg: "Test Error";
    },
    {
      code: 6001;
      name: "NotSeedSocietyPlant";
      msg: "Must only provide Seed Society mints";
    },
    {
      code: 6002;
      name: "IncorrectName";
      msg: "Plant name must match metadata";
    },
    {
      code: 6003;
      name: "SignerNotOwner";
      msg: "Must only provide token accounts owned by signer";
    },
    {
      code: 6004;
      name: "IncorrectMintForTokenAccount";
      msg: "Provided token account does not match mint";
    },
    {
      code: 6005;
      name: "IncorrectTokenAccountBalance";
      msg: "Provided token account does not own a plant";
    },
    {
      code: 6006;
      name: "PlantDead";
      msg: "This plant is dead";
    },
    {
      code: 6007;
      name: "PlantWaterTooOften";
      msg: "Plant watered too often";
    },
    {
      code: 6008;
      name: "GardenerWaterTooOften";
      msg: "Gardener watering too often";
    },
    {
      code: 6009;
      name: "WrongGardener";
      msg: "Wrong gardener";
    }
  ];
};

export const IDL: SeedSociety = {
  version: "0.1.0",
  name: "seed_society",
  instructions: [
    {
      name: "init",
      accounts: [
        {
          name: "plant",
          isMut: true,
          isSigner: false,
        },
        {
          name: "plantMint",
          isMut: false,
          isSigner: false,
        },
        {
          name: "plantToken",
          isMut: false,
          isSigner: false,
        },
        {
          name: "plantMetadata",
          isMut: false,
          isSigner: false,
        },
        {
          name: "authority",
          isMut: true,
          isSigner: true,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "plantName",
          type: {
            array: ["u8", 12],
          },
        },
        {
          name: "plantBump",
          type: "u8",
        },
      ],
    },
    {
      name: "water",
      accounts: [
        {
          name: "plant",
          isMut: true,
          isSigner: false,
        },
        {
          name: "gardener",
          isMut: true,
          isSigner: false,
        },
        {
          name: "ownedPlantMint",
          isMut: false,
          isSigner: false,
        },
        {
          name: "ownedPlantToken",
          isMut: false,
          isSigner: false,
        },
        {
          name: "ownedMetadata",
          isMut: false,
          isSigner: false,
        },
        {
          name: "plantMint",
          isMut: false,
          isSigner: false,
        },
        {
          name: "plantToken",
          isMut: true,
          isSigner: false,
        },
        {
          name: "plantMetadata",
          isMut: true,
          isSigner: false,
        },
        {
          name: "freezeAuthority",
          isMut: false,
          isSigner: false,
        },
        {
          name: "metadataAuthority",
          isMut: false,
          isSigner: false,
        },
        {
          name: "authority",
          isMut: true,
          isSigner: true,
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "metadataProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "plantName",
          type: {
            array: ["u8", 12],
          },
        },
        {
          name: "gardenerBump",
          type: "u8",
        },
      ],
    },
    {
      name: "checkDead",
      accounts: [
        {
          name: "plant",
          isMut: false,
          isSigner: false,
        },
        {
          name: "authority",
          isMut: true,
          isSigner: true,
        },
      ],
      args: [],
    },
    {
      name: "closePlantAccountAdmin",
      accounts: [
        {
          name: "plant",
          isMut: true,
          isSigner: false,
        },
        {
          name: "plantMetadata",
          isMut: false,
          isSigner: false,
        },
        {
          name: "authority",
          isMut: true,
          isSigner: true,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "plantName",
          type: {
            array: ["u8", 12],
          },
        },
      ],
    },
    {
      name: "closeGardenerAccountAdmin",
      accounts: [
        {
          name: "gardener",
          isMut: true,
          isSigner: false,
        },
        {
          name: "authority",
          isMut: true,
          isSigner: true,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "owner",
          type: "publicKey",
        },
        {
          name: "bump",
          type: "u8",
        },
      ],
    },
    {
      name: "nukeMetadataAdmin",
      accounts: [
        {
          name: "metadataAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "authority",
          isMut: true,
          isSigner: true,
        },
        {
          name: "metadataAuthority",
          isMut: false,
          isSigner: false,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "metadataProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [],
    },
  ],
  accounts: [
    {
      name: "plant",
      type: {
        kind: "struct",
        fields: [
          {
            name: "name",
            type: {
              array: ["u8", 12],
            },
          },
          {
            name: "mint",
            type: "publicKey",
          },
          {
            name: "watered",
            type: "u32",
          },
          {
            name: "waterTimeout",
            type: "i64",
          },
          {
            name: "level",
            type: "u8",
          },
          {
            name: "bump",
            type: "u8",
          },
        ],
      },
    },
    {
      name: "gardener",
      type: {
        kind: "struct",
        fields: [
          {
            name: "wateredOthers",
            type: "u32",
          },
          {
            name: "watered",
            type: "u32",
          },
          {
            name: "wateredInTimeframe",
            type: "u32",
          },
          {
            name: "waterTimeout",
            type: "i64",
          },
          {
            name: "authority",
            type: "publicKey",
          },
          {
            name: "bump",
            type: "u8",
          },
          {
            name: "initialized",
            type: "bool",
          },
        ],
      },
    },
  ],
  errors: [
    {
      code: 6000,
      name: "TestError",
      msg: "Test Error",
    },
    {
      code: 6001,
      name: "NotSeedSocietyPlant",
      msg: "Must only provide Seed Society mints",
    },
    {
      code: 6002,
      name: "IncorrectName",
      msg: "Plant name must match metadata",
    },
    {
      code: 6003,
      name: "SignerNotOwner",
      msg: "Must only provide token accounts owned by signer",
    },
    {
      code: 6004,
      name: "IncorrectMintForTokenAccount",
      msg: "Provided token account does not match mint",
    },
    {
      code: 6005,
      name: "IncorrectTokenAccountBalance",
      msg: "Provided token account does not own a plant",
    },
    {
      code: 6006,
      name: "PlantDead",
      msg: "This plant is dead",
    },
    {
      code: 6007,
      name: "PlantWaterTooOften",
      msg: "Plant watered too often",
    },
    {
      code: 6008,
      name: "GardenerWaterTooOften",
      msg: "Gardener watering too often",
    },
    {
      code: 6009,
      name: "WrongGardener",
      msg: "Wrong gardener",
    },
  ],
};

export type Plant = {
  name: string;
  mint: PublicKey;
  watered: number;
  waterTimeout: BN;
  level: number;
  bump: number;
  pubkey: PublicKey;
  owner: PublicKey;
};

export type Gardener = {
  wateredOthers: number;
  watered: number;
  wateredInTimeframe: number;
  waterTimeout: BN;
  authority: PublicKey;
  bump: number;
  initialized: boolean;
};
