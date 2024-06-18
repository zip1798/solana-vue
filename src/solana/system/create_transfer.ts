import { Connection, Keypair, SystemProgram, Transaction, PublicKey, LAMPORTS_PER_SOL  } from '@solana/web3.js';

export function createTransfer(transaction: Transaction, from: PublicKey, to: PublicKey, amount: number) { 
    transaction.add(
        SystemProgram.transfer({
            fromPubkey: from,
            toPubkey: to, 
            lamports: amount * LAMPORTS_PER_SOL,
        })
    )
}