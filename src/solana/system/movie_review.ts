import { Transaction, PublicKey, TransactionInstruction, SystemProgram } from '@solana/web3.js';
import { Movie } from '../../models/Movie';
import { initConnection, sendAndConfirmTransaction } from '../utils';
import { MOVIE_REVIEW_PROGRAM_ID, SOLANA_NETWORK } from '../../settings';

export async function createMovieReview(title: string, description: string, rating: number) {
    const movie = new Movie(title, rating, description);
    const { connection, publicKey } = initConnection();
    if (!publicKey) throw new Error('No wallet found');

    const buffer = movie.serialize();
    const transaction = new Transaction();
    
    const pda = await getMovieReviewPda(publicKey, title);
    const instruction = prepareInstruction(buffer, pda, publicKey);
    transaction.add(instruction);

    let txid = await sendAndConfirmTransaction(connection, transaction)
    console.log(`Transaction sent: https://explorer.solana.com/tx/${txid}?cluster=${SOLANA_NETWORK}`) 
    
    return txid
}

async function getMovieReviewPda(publicKey: PublicKey, title: string) {
    const [ pda ] = await PublicKey.findProgramAddressSync(
        [publicKey.toBuffer(), new TextEncoder().encode(title)],
        new PublicKey(MOVIE_REVIEW_PROGRAM_ID)
    ) 

    return pda
}

function prepareInstruction(buffer: Buffer, pda: PublicKey, publicKey: PublicKey) {
    return new TransactionInstruction({
        keys: [
            {pubkey: publicKey, isSigner: true, isWritable: false},
            {pubkey: pda, isSigner: false, isWritable: true},
            {pubkey: SystemProgram.programId, isSigner: false, isWritable: false}
        ],
        data: buffer,
        programId: new PublicKey(MOVIE_REVIEW_PROGRAM_ID)
    })
}

export async function loadMovieReviews() {
    const { connection, publicKey } = initConnection();
    
    if (!publicKey) throw new Error('No wallet found');

    const accounts = await connection.getParsedProgramAccounts(new PublicKey(MOVIE_REVIEW_PROGRAM_ID));
    const movies = accounts.map(({account}) => {
        return Movie.deserialize(account.data as Buffer)
    });

    return movies
}