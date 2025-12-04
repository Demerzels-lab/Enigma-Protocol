# Enigma Protocol

[![Build Status](https://img.shields.io/github/actions/workflow/status/Demerzels-lab/Enigma-Protocol/ci.yml?branch=main)](https://github.com/Demerzels-lab/Enigma-Protocol/actions)
[![Coverage](https://img.shields.io/codecov/c/github/Demerzels-lab/Enigma-Protocol)](https://codecov.io/gh/Demerzels-lab/Enigma-Protocol)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Protocol Version](https://img.shields.io/badge/protocol-v2.1.0-lightgrey)](https://github.com/Demerzels-lab/Enigma-Protocol/releases)

Enigma Protocol is a non-custodial, privacy-preserving liquidity layer built on Ethereum, integrating **Zero-Knowledge Succinct Non-Interactive Arguments of Knowledge (zk-SNARKs)** with an **ERC-8004 compliant autonomous agent network**.

The protocol addresses the inherent transparency-privacy paradox in public ledgers by decoupling transaction provenance from execution. It enables institutional-grade capital efficiency through algorithmic yield optimization strategies while maintaining cryptographic unlinkability via stealth address derivation (EIP-5564) and recursive proof generation.

## Architectural Overview

Enigma operates as a hybrid compute architecture, leveraging off-chain computation for complex ZK-circuit generation and AI inference, with on-chain verification and settlement.

### High-Level Topology

The Enigma Protocol operates through a layered architecture:

1. **Client Interface**: Users interact through web/mobile applications, generating signatures and ZK proofs.

2. **Edge Compute Layer**: Handles off-chain computations including ZK proof generation and AI inference, ensuring <50ms latency.

3. **Smart Contract Protocol**: On-chain verification and settlement of transactions using Ethereum's Proof-of-Stake consensus.

**Privacy Layer Components:**
- **Circom Circuits**: ZK circuit definitions using Groth16 proving system
- **Shielded Pools**: Privacy-preserving liquidity aggregation with sparse Merkle trees
- **Transaction Relayers**: Decentralized network for anonymous proof submission

**Intelligence Layer Components:**
- **ERC-8004 Agents**: Autonomous AI entities for liquidity management
- **Off-chain Solvers**: Strategy computation engines using Optimistic Machine Learning
- **Data Oracles**: External data feeds for market intelligence

**Data Flow:**
- Users → Client Interface → Edge Compute Layer → Smart Contract Protocol
- Bidirectional communication between ERC-8004 Agents and Off-chain Solvers
- Privacy Layer components handle cryptographic operations
- Intelligence Layer components manage algorithmic strategies

## Core Infrastructure Modules

### 1. Cryptographic Primitives & Privacy Engine

The core of Enigma's privacy guarantee relies on the Groth16 proving system over the bn128 curve.

**Shielded Liquidity Aggregation:** Utilizes sparse Merkle trees to maintain a state of commitments. Deposits generate a commitment hash (Pedersen Hash), while withdrawals require a valid Zero-Knowledge proof of inclusion and a nullifier to prevent double-spending.

**EIP-5564 Implementation:** Automates the derivation of stealth meta-addresses on the client side using elliptic curve Diffie-Hellman (ECDH), ensuring that on-chain addresses cannot be cryptographically linked to the recipient's static identifier.

**Relayer Network:** To solve the "gas payment reveals identity" problem, Enigma integrates a decentralized relayer network that submits proofs on behalf of users, taking a fee from the shielded asset itself.

### 2. Verifiable Autonomous Agents (ERC-8004)

Enigma deploys a fleet of sovereign AI agents tasked with liquidity management and arbitrage execution.

**Optimistic Machine Learning (OML):** Strategy inference occurs off-chain to reduce gas overhead. Execution payloads are submitted on-chain with a validity proof, allowing for high-frequency strategy rebalancing.

**MEV Resistance:** Agents route transactions through private mempools (Flashbots) to mitigate front-running and sandwich attacks during yield harvesting events.

**Circuit Breakers:** Real-time on-chain monitoring daemons continuously assess protocol health, capable of pausing agent execution if volatility thresholds or slippage parameters are breached.

### 3. Data Availability & State Management

The interface layer interacts with a highly available, cryptographically verifiable state layer.

**Edge Computing:** Critical computations, including ZK-proof generation and agent status polling, are distributed across global edge functions to ensure <50ms latency.

**Row-Level Security (RLS):** User data is isolated at the database level using Postgres RLS policies, authenticated via wallet signatures. This ensures that even in the event of a backend compromise, private user metadata remains inaccessible.

## Protocol Specifications

| Parameter | Specification |
|-----------|---------------|
| Consensus Mechanism | Proof-of-Stake (Ethereum Mainnet) |
| ZK Circuit Scheme | Groth16 / Circom 2.1 |
| Hashing Algorithm | Poseidon (Optimized for ZK constraints) |
| Agent Standard | ERC-8004 (Native AI Smart Accounts) |
| Frontend Framework | React 18 / TypeScript / Vite |
| State Layer | Supabase (PostgreSQL 15) |

## SDK & Integration

Enigma Protocol provides a strictly typed SDK for programmatic interaction with the shielded pools and agent registry.

```typescript
import { EnigmaSDK, ProofGenerator } from '@enigma-protocol/sdk';

// Initialize SDK with Provider
const enigma = new EnigmaSDK(provider);

// Generate ZK Proof for Deposit
const deposit = async (amount: bigint) => {
  const commitment = await ProofGenerator.createCommitment();
  const proof = await ProofGenerator.generateProof(commitment, amount);
  
  // Submit to Shielded Pool Contract
  return await enigma.contracts.PrivacyPool.deposit(
    proof.solidityProof,
    proof.publicSignals
  );
};
```

## Security & Audits

The protocol undergoes continuous integration testing and static analysis. Security is enforced through a multi-layered approach:

**Formal Verification:** Core ZK circuits have been formally verified to ensure soundness and completeness.

**Trusted Setup:** The Phase 2 trusted setup for Groth16 circuits was conducted via a multi-party computation (MPC) ceremony.

**Immutable Deployment:** Smart contracts are deployed via deterministic CREATE2 opcodes to ensure bytecode verification.

For vulnerability disclosures, please refer to our Security Policy and utilize the provided PGP keys for encrypted communication.

## Governance

Enigma Protocol is governed by the Enigma DAO. Protocol parameters, including agent allow-lists, fee structures, and circuit upgrades, are managed via on-chain governance proposals (GovernorBravo).

## License

Copyright (c) 2025 Enigma Protocol Foundation. All rights reserved.

Licensed under the MIT License.
    cp .env.example .env.local
    ```

4.  **Run Development Server**
    ```bash
    pnpm dev
    ```

## Development Protocols

### Code Standards
* **Strict Type Safety:** TypeScript strict mode is enabled for all packages.
* **Linting:** ESLint and Prettier configurations are enforced via pre-commit hooks.
* **Component Architecture:** Atomic design principles applied to React components.

### Build & Deploy
The application utilizes Vite for optimized production builds.

```bash
# Production build
pnpm build

# Preview production build locally
pnpm preview