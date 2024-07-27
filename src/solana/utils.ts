import { useWallet, useAnchorWallet } from 'solana-wallets-vue';
import { Connection, clusterApiUrl, Transaction} from '@solana/web3.js';
import { SOLANA_NETWORK } from '../settings';


export function initConnection() {
    const connection = new Connection(clusterApiUrl(SOLANA_NETWORK))
    const { publicKey } = useWallet();
    if (!publicKey.value) throw new Error('No wallet found');

    return {connection, publicKey: publicKey.value};
}

export async function sendAndConfirmTransaction(connection: Connection, transaction: Transaction, options?: any) {
    const { sendTransaction } = useWallet();
    const signature = await sendTransaction(transaction, connection, options);
    await connection.confirmTransaction(signature, 'confirmed');
}