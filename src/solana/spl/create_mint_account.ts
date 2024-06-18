import { Connection, Keypair, SystemProgram, Transaction, PublicKey  } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID,  MINT_SIZE, getMinimumBalanceForRentExemptMint, createInitializeMint2Instruction } from "@solana/spl-token";

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
  