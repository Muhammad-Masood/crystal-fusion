export const contractAddress: string =
  "0x174F4C3A79cBddcf6082A8D61Ef04Be133052d36";
export const contractABI: any[] = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "AccessControlBadConfirmation",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        internalType: "bytes32",
        name: "neededRole",
        type: "bytes32",
      },
    ],
    name: "AccessControlUnauthorizedAccount",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "length",
        type: "uint256",
      },
    ],
    name: "StringsInsufficientHexLength",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "_admin",
        type: "address",
      },
    ],
    name: "Admin",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "bytes32",
        name: "previousAdminRole",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "bytes32",
        name: "newAdminRole",
        type: "bytes32",
      },
    ],
    name: "RoleAdminChanged",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "sender",
        type: "address",
      },
    ],
    name: "RoleGranted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "sender",
        type: "address",
      },
    ],
    name: "RoleRevoked",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "string",
        name: "qrHash",
        type: "string",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "timestamp",
        type: "uint256",
      },
    ],
    name: "StepRecorded",
    type: "event",
  },
  {
    inputs: [],
    name: "DEFAULT_ADMIN_ROLE",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_address",
        type: "address",
      },
    ],
    name: "GrantAdminRole",
    outputs: [
      {
        internalType: "bool",
        name: "success",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_address",
        type: "address",
      },
    ],
    name: "TransferOwner",
    outputs: [
      {
        internalType: "bool",
        name: "success",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_qrHash",
        type: "string",
      },
    ],
    name: "addRecords",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "getAllProducts",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "id",
            type: "uint256",
          },
          {
            internalType: "string",
            name: "qrHash",
            type: "string",
          },
          {
            components: [
              {
                internalType: "string",
                name: "tracking",
                type: "string",
              },
              {
                internalType: "uint256",
                name: "timestamp",
                type: "uint256",
              },
            ],
            internalType: "struct VerificationProcess.CsShipping",
            name: "csShipping",
            type: "tuple",
          },
          {
            components: [
              {
                internalType: "string",
                name: "analysisHash",
                type: "string",
              },
              {
                internalType: "uint256",
                name: "timestamp",
                type: "uint256",
              },
            ],
            internalType: "struct VerificationProcess.Analysis",
            name: "analysis",
            type: "tuple",
          },
          {
            components: [
              {
                internalType: "string",
                name: "tracking",
                type: "string",
              },
              {
                internalType: "uint256",
                name: "timestamp",
                type: "uint256",
              },
            ],
            internalType: "struct VerificationProcess.CFShipping",
            name: "cfShipping",
            type: "tuple",
          },
          {
            components: [
              {
                internalType: "string[]",
                name: "certificatesHashes",
                type: "string[]",
              },
              {
                internalType: "uint256",
                name: "timestamp",
                type: "uint256",
              },
            ],
            internalType: "struct VerificationProcess.Certificate",
            name: "certificate",
            type: "tuple",
          },
          {
            components: [
              {
                internalType: "string",
                name: "tracking",
                type: "string",
              },
              {
                internalType: "uint256",
                name: "timestamp",
                type: "uint256",
              },
            ],
            internalType: "struct VerificationProcess.ShippingTwo",
            name: "shippingTwo",
            type: "tuple",
          },
          {
            components: [
              {
                internalType: "string",
                name: "tracking",
                type: "string",
              },
              {
                internalType: "uint256",
                name: "timestamp",
                type: "uint256",
              },
            ],
            internalType: "struct VerificationProcess.FinalDelivery",
            name: "finalDelivery",
            type: "tuple",
          },
          {
            internalType: "uint256",
            name: "timestamp",
            type: "uint256",
          },
        ],
        internalType: "struct VerificationProcess.OrderDetails[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
    ],
    name: "getOrders",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "id",
            type: "uint256",
          },
          {
            internalType: "string",
            name: "qrHash",
            type: "string",
          },
          {
            components: [
              {
                internalType: "string",
                name: "tracking",
                type: "string",
              },
              {
                internalType: "uint256",
                name: "timestamp",
                type: "uint256",
              },
            ],
            internalType: "struct VerificationProcess.CsShipping",
            name: "csShipping",
            type: "tuple",
          },
          {
            components: [
              {
                internalType: "string",
                name: "analysisHash",
                type: "string",
              },
              {
                internalType: "uint256",
                name: "timestamp",
                type: "uint256",
              },
            ],
            internalType: "struct VerificationProcess.Analysis",
            name: "analysis",
            type: "tuple",
          },
          {
            components: [
              {
                internalType: "string",
                name: "tracking",
                type: "string",
              },
              {
                internalType: "uint256",
                name: "timestamp",
                type: "uint256",
              },
            ],
            internalType: "struct VerificationProcess.CFShipping",
            name: "cfShipping",
            type: "tuple",
          },
          {
            components: [
              {
                internalType: "string[]",
                name: "certificatesHashes",
                type: "string[]",
              },
              {
                internalType: "uint256",
                name: "timestamp",
                type: "uint256",
              },
            ],
            internalType: "struct VerificationProcess.Certificate",
            name: "certificate",
            type: "tuple",
          },
          {
            components: [
              {
                internalType: "string",
                name: "tracking",
                type: "string",
              },
              {
                internalType: "uint256",
                name: "timestamp",
                type: "uint256",
              },
            ],
            internalType: "struct VerificationProcess.ShippingTwo",
            name: "shippingTwo",
            type: "tuple",
          },
          {
            components: [
              {
                internalType: "string",
                name: "tracking",
                type: "string",
              },
              {
                internalType: "uint256",
                name: "timestamp",
                type: "uint256",
              },
            ],
            internalType: "struct VerificationProcess.FinalDelivery",
            name: "finalDelivery",
            type: "tuple",
          },
          {
            internalType: "uint256",
            name: "timestamp",
            type: "uint256",
          },
        ],
        internalType: "struct VerificationProcess.OrderDetails",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
    ],
    name: "getRoleAdmin",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "grantRole",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "hasRole",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "orders",
    outputs: [
      {
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "qrHash",
        type: "string",
      },
      {
        components: [
          {
            internalType: "string",
            name: "tracking",
            type: "string",
          },
          {
            internalType: "uint256",
            name: "timestamp",
            type: "uint256",
          },
        ],
        internalType: "struct VerificationProcess.CsShipping",
        name: "csShipping",
        type: "tuple",
      },
      {
        components: [
          {
            internalType: "string",
            name: "analysisHash",
            type: "string",
          },
          {
            internalType: "uint256",
            name: "timestamp",
            type: "uint256",
          },
        ],
        internalType: "struct VerificationProcess.Analysis",
        name: "analysis",
        type: "tuple",
      },
      {
        components: [
          {
            internalType: "string",
            name: "tracking",
            type: "string",
          },
          {
            internalType: "uint256",
            name: "timestamp",
            type: "uint256",
          },
        ],
        internalType: "struct VerificationProcess.CFShipping",
        name: "cfShipping",
        type: "tuple",
      },
      {
        components: [
          {
            internalType: "string[]",
            name: "certificatesHashes",
            type: "string[]",
          },
          {
            internalType: "uint256",
            name: "timestamp",
            type: "uint256",
          },
        ],
        internalType: "struct VerificationProcess.Certificate",
        name: "certificate",
        type: "tuple",
      },
      {
        components: [
          {
            internalType: "string",
            name: "tracking",
            type: "string",
          },
          {
            internalType: "uint256",
            name: "timestamp",
            type: "uint256",
          },
        ],
        internalType: "struct VerificationProcess.ShippingTwo",
        name: "shippingTwo",
        type: "tuple",
      },
      {
        components: [
          {
            internalType: "string",
            name: "tracking",
            type: "string",
          },
          {
            internalType: "uint256",
            name: "timestamp",
            type: "uint256",
          },
        ],
        internalType: "struct VerificationProcess.FinalDelivery",
        name: "finalDelivery",
        type: "tuple",
      },
      {
        internalType: "uint256",
        name: "timestamp",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "index",
        type: "uint256",
      },
    ],
    name: "removeOrders",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "renounceRole",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_address",
        type: "address",
      },
    ],
    name: "revokePropertyAdminRole",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "revokeRole",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes4",
        name: "interfaceId",
        type: "bytes4",
      },
    ],
    name: "supportsInterface",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalOrders",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "_hash",
        type: "string",
      },
    ],
    name: "updateAnalysisHASH",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "_tracking",
        type: "string",
      },
    ],
    name: "updateCFshippingLabal",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "_hash",
        type: "string",
      },
    ],
    name: "updateCertificateHASH",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "_tracking",
        type: "string",
      },
    ],
    name: "updatePickupShippingTracking",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "_tracking",
        type: "string",
      },
    ],
    name: "updateShippingTwoLabal",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "_tracking",
        type: "string",
      },
    ],
    name: "updatefinalDeliveryTracking",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    stateMutability: "payable",
    type: "receive",
  },
];
