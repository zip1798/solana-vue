import { Transaction, PublicKey, TransactionInstruction, SystemProgram } from '@solana/web3.js';
import { Movie } from '../../models/Movie';
import { initConnection, sendAndConfirmTransaction } from '../utils';
import { MOVIE_REVIEW_PROGRAM_ID, SOLANA_NETWORK } from '../../settings';
import bs58 from 'bs58';

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

export class MovieRepository {

    // list of all PDA accounts PublicKey of this program
    static accounts: PublicKey[] = [];

    // init of list of PDA accounts
    static async prefechAccounts(search: string = '') {
        const { connection } = initConnection()
        const accounts = await connection.getProgramAccounts(
            new PublicKey(MOVIE_REVIEW_PROGRAM_ID),
            this.prepareFetchAccountOptions(search)
        )

        // accounts.sort( (a, b) => {
        //     const lengthA = a.account.data.readUInt32LE(0)
        //     const lengthB = b.account.data.readUInt32LE(0)
        //     const dataA = a.account.data.slice(4, 4 + lengthA)
        //     const dataB = b.account.data.slice(4, 4 + lengthB)
        //     return dataA.compare(dataB)
        // })

        console.log(accounts)
        this.accounts =  accounts.map( account => account.pubkey)
        
        return this.accounts
    }

    static prepareFetchAccountOptions(search: string = '') {
        if (search === '') {
            return {
                dataSlice: { offset: 0, length: 0}
            }
        }

        return {
            dataSlice: { offset: 2, length: 18 },
            filters: [
                { 
                    memcmp: { 
                        offset: 6, 
                        bytes: bs58.encode(Buffer.from(search)) 
                    } 
                }
            ]
        }
    }

    static accountSort(accounts: PublicKey[]): PublicKey[] {

        return accounts
    }

    static async fetchPage(page: number, perPage: number): Promise<(Movie|null)[]> {
        if (this.accounts.length === 0) {
            await this.prefechAccounts()
        }

        const paginatedPublicKeys = this.accounts.slice((page - 1) * perPage, page * perPage)
        if (paginatedPublicKeys.length === 0) {
            return []
        }

        const { connection } = initConnection()
        const accounts = await connection.getMultipleAccountsInfo(paginatedPublicKeys)

        let movies: (Movie|null)[] = [];
        accounts.forEach((account) => {
            const movie: (Movie | null) = Movie.deserialize(account?.data as Buffer)
            if (movie) {
                movies.push(movie)
            }
        })

        return movies
    }
    
    static async loadMovieReviews() {
        const { connection } = initConnection();
    
        const accounts = await connection.getParsedProgramAccounts(new PublicKey(MOVIE_REVIEW_PROGRAM_ID));
        const movies = accounts.map(({account}) => {
            return Movie.deserialize(account.data as Buffer)
        });
    
        return movies
    }

}