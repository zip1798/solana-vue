import idl from "../../idl/anchor_counter.json";
import { useAnchorWallet } from 'solana-wallets-vue';
import {
    Keypair, 
    PublicKey,
    Connection, 
    clusterApiUrl,
} from '@solana/web3.js';
import { SOLANA_NETWORK } from '../../settings';

import {
    Program,
    Idl,
    AnchorProvider,
    setProvider, 
} from "@coral-xyz/anchor"
import { bs58 } from "@coral-xyz/anchor/dist/cjs/utils/bytes";
import { BN } from "@coral-xyz/anchor";


interface CounterTransactionResult {
    txSig: string,
    link?: string,
    method?: string
}

export function generateNewKeypair() : Keypair {
    return Keypair.generate();
}

function getProgram() {
    const connection = new Connection(clusterApiUrl(SOLANA_NETWORK))
    const anchorWallet = useAnchorWallet();
    //@ts-ignore
    console.log('anchorWallet', anchorWallet.value.publicKey.toBase58())

    //@ts-ignore
    const provider = new AnchorProvider(connection, anchorWallet.value, {});
    setProvider(provider)

    return new Program(idl as Idl);
}

export async function initialize(keypair: Keypair) : Promise<CounterTransactionResult> {
    const program = getProgram()

    const txSig = await program.methods
        .initialize()
        .accounts({
            counter: keypair.publicKey,
        })
        .signers([keypair])
        .rpc()

    return {
        txSig,
        link: `https://explorer.solana.com/tx/${txSig}?cluster=devnet`,
        method: 'initialize'
    };
}

export async function increment(counter: Keypair) : Promise<CounterTransactionResult> {
    const program = getProgram()

    const txSig = await program.methods
        .increment()
        .accounts({
            counter: counter.publicKey,
        })
        .rpc()
    
    return {
        txSig,
        link: `https://explorer.solana.com/tx/${txSig}?cluster=devnet`,
        method: 'increment'
    };
}

export async function decrement(counter: Keypair) : Promise<CounterTransactionResult> {
    const program = getProgram()

    const txSig = await program.methods
        .decrement()
        .accounts({
            counter: counter.publicKey,
        })
        .rpc()
    
    return {
        txSig,
        link: `https://explorer.solana.com/tx/${txSig}?cluster=devnet`,
        method: 'decrement'
    };
}


export async function getCounters() {
    const program = getProgram()
    //@ts-ignore
    const accounts = await program.account.counter.all([
        {
            memcmp: {
                offset: 8,
                bytes: bs58.encode((new BN(0, 'le')).toArray())
            }
        }
    ]);
    return accounts
}

export async function getCounter(publicKey: PublicKey) {
    console.log(publicKey.toBase58())
    const program = getProgram()
    //@ts-ignore
    const counterAccount = await program.account.counter.fetch(publicKey)
    return counterAccount
}