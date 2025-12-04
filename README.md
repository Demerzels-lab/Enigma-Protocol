# Enigma Protocol

Enigma Protocol is a privacy-first decentralized finance platform that integrates Zero-Knowledge Proofs (ZKP) with autonomous AI agents. It enables users to execute complex DeFi strategies, such as yield farming and arbitrage, while maintaining complete transactional anonymity through cryptographic primitives and ERC-8004 compliant agents.

## Overview

The protocol addresses the transparency-privacy paradox in public blockchains by introducing a compliant privacy layer. By leveraging zk-SNARKs and stealth address generation (EIP-5564), Enigma allows capital to move and compound without exposing the user's identity or historical activity to on-chain surveillance.

## Core Architecture

### 1. Privacy Infrastructure
* **Zero-Knowledge Proofs:** Utilizes zk-SNARKs to generate proofs of solvency and transaction validity without revealing underlying data.
* **Stealth Addresses:** Implements EIP-5564 to automatically generate unique, one-time addresses for every incoming transaction, severing the link between sender and receiver.
* **Privacy Pools:** A smart contract-based mixing service that aggregates liquidity to obfuscate transaction trails.

### 2. Autonomous Agent Network
* **ERC-8004 Compliance:** AI agents are deployed as verifiable smart entities that can own assets and execute transactions autonomously.
* **Strategy Engines:**
    * **Yield Optimization:** Continuously scans cross-chain protocols for highest risk-adjusted APY.
    * **MEV-Resistant Arbitrage:** Executes trades via private mempools to avoid front-running.
    * **Risk Management:** Automated circuit breakers based on on-chain volatility metrics.

### 3. Technical Stack
* **Frontend:** React, TypeScript, Vite, Tailwind CSS
* **State Management:** Supabase (PostgreSQL with Row Level Security)
* **Edge Computing:** Supabase Edge Functions (Deno) for off-chain computation
* **Web3 Integration:** Ethers.js, WalletConnect

## Getting Started

### Prerequisites
* Node.js >= 20.0.0
* pnpm >= 9.0.0

### Installation

1.  **Clone the repository**
    ```bash
    git clone [https://github.com/Demerzels-lab/Enigma-Protocol.git](https://github.com/Demerzels-lab/Enigma-Protocol.git)
    cd Enigma-Protocol
    ```

2.  **Install dependencies**
    ```bash
    pnpm install
    ```

3.  **Environment Configuration**
    Copy the example environment file and configure your keys.
    ```bash
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