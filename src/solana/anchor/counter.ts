import idl from "../../idl/anchor_counter.json";
import { useAnchorWallet } from 'solana-wallets-vue';
import {
    Keypair, 
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


import {
    getExplorerLink,
  } from "@solana-developers/helpers";

interface CounterTransactionResult {
    txSig: string,
    link?: string
}

export function generateNewKeypair() : Keypair {
    return Keypair.generate();
}

export async function initialize(keypair: Keypair) : Promise<CounterTransactionResult> {
    const connection = new Connection(clusterApiUrl(SOLANA_NETWORK))
    const anchorWallet = useAnchorWallet();
    //@ts-ignore
    console.log('anchorWallet', anchorWallet.value.publicKey.toBase58())

    //@ts-ignore
    const provider = new AnchorProvider(connection, anchorWallet.value, {});
    setProvider(provider)

    const program = new Program(idl as Idl);

    const txSig = await program.methods
        .initialize()
        .accounts({
            counter: keypair.publicKey,
        })
        .signers([keypair])
        .rpc()

    return {
        txSig,
        link: getExplorerLink("transaction", txSig, "devnet")
    };
}