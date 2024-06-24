import { Connection, Keypair, SystemProgram, Transaction, PublicKey  } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID,  ASSOCIATED_TOKEN_PROGRAM_ID, MINT_SIZE, getMinimumBalanceForRentExemptMint
  , createInitializeMint2Instruction, createMintToInstruction, getAssociatedTokenAddressSync,
   getAccount, Account, TokenInvalidMintError, TokenInvalidOwnerError,
   createAssociatedTokenAccountInstruction } from "@solana/spl-token";
import { createCreateMetadataAccountV3Instruction } from "@metaplex-foundation/mpl-token-metadata";

const TOKEN_METADATA_PROGRAM_ID = new PublicKey(
    "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
  );
export async function splCreateMintAccount(connection: Connection, transaction: Transaction, payer: PublicKey, decimals: number) {
      const lamports = await getMinimumBalanceForRentExemptMint(connection);
      const keypair = Keypair.generate();
      const programId = TOKEN_PROGRAM_ID;
  
      transaction.add(
          SystemProgram.createAccount({
              fromPubkey: payer,
              newAccountPubkey: keypair.publicKey,
              space: MINT_SIZE,
              lamports,
              programId,
          })); 
      transaction.add(
          createInitializeMint2Instruction(
            keypair.publicKey, 
            decimals, 
            payer, 
            payer, 
            programId
          )
      );
      
      return { keypair };
  }
  
export function splSetMetadata(transaction: Transaction, mint: PublicKey, payer: PublicKey, name: string, symbol: string, uri: string) {
    const metadataData = {
        name: name,
        symbol: symbol,
        // Arweave / IPFS / Pinata etc link using metaplex standard for off-chain data
        uri: uri,
        sellerFeeBasisPoints: 0,
        creators: null,
        collection: null,
        uses: null,
      };
      
      const metadataPDAAndBump = PublicKey.findProgramAddressSync(
        [
          Buffer.from("metadata"),
          TOKEN_METADATA_PROGRAM_ID.toBuffer(),
          mint.toBuffer(),
        ],
        TOKEN_METADATA_PROGRAM_ID
      );
      
      const metadataPDA = metadataPDAAndBump[0];
      
      const createMetadataAccountInstruction = createCreateMetadataAccountV3Instruction(  
           {
             metadata: metadataPDA,
             mint: mint,
             mintAuthority: payer,
             payer: payer,
             updateAuthority: payer,
           },
           {
             createMetadataAccountArgsV3: {
               collectionDetails: null,
               data: metadataData,
               isMutable: true,
             },
           }
        );
      
      transaction.add(createMetadataAccountInstruction);
}  

export async function getTokenAccount(connection: Connection, mint: PublicKey, owner: PublicKey) {
  const associatedToken = getAssociatedTokenAddressSync(
    mint,
    owner,
    false,
    TOKEN_PROGRAM_ID,
    ASSOCIATED_TOKEN_PROGRAM_ID
  );
  let account: Account;
  account = await getAccount(connection, associatedToken, undefined, TOKEN_PROGRAM_ID);
  if (!account.mint.equals(mint)) throw new TokenInvalidMintError();
  if (!account.owner.equals(owner)) throw new TokenInvalidOwnerError();


  return associatedToken;
}

export async function getTokenBalance(connection: Connection, mint: PublicKey, owner: PublicKey) {
  const associatedToken = getAssociatedTokenAddressSync(
    mint,
    owner,
    false,
    TOKEN_PROGRAM_ID,
    ASSOCIATED_TOKEN_PROGRAM_ID
  );
  let account: Account;
  account = await getAccount(connection, associatedToken, undefined, TOKEN_PROGRAM_ID);
  
  return account.amount;
}

export async function createTokenAccount(transaction: Transaction, mint: PublicKey, payer: PublicKey, destination: PublicKey) {
  const associatedToken = getAssociatedTokenAddressSync(
    mint,
    destination,
    false,
    TOKEN_PROGRAM_ID,
    ASSOCIATED_TOKEN_PROGRAM_ID
  );

  transaction.add(
    createAssociatedTokenAccountInstruction(
        payer,
        associatedToken,
        destination,
        mint,
        TOKEN_PROGRAM_ID,
        ASSOCIATED_TOKEN_PROGRAM_ID
    )
  );

  return associatedToken;
}

export async function mintToken(transaction: Transaction, mint: PublicKey, payer: PublicKey, tokenAssociatedAccount: PublicKey, amount: number) {
  transaction.add(createMintToInstruction(
    mint,
    tokenAssociatedAccount,
    payer,
    amount
  ));
}