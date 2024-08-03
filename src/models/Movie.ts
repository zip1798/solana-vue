import * as borsh from "@coral-xyz/borsh";

export class Movie {
    title: string;
    rating: number;
    description: string;

    borshInstructionSchema = borsh.struct([
        borsh.u8("variant"),
        borsh.str("title"),
        borsh.u8("rating"),
        borsh.str("description"),
    ])

    static borshAccountShema = borsh.struct([
        borsh.bool("initialized"),
        borsh.u8("rating"),
        borsh.str("title"),
        borsh.str("description"),
    ])

    constructor(title: string, rating: number, description: string) {
        this.title = title;
        this.rating = rating;
        this.description = description;
    }

    serialize(): Buffer {
        const buffer = Buffer.alloc(1000)
        this.borshInstructionSchema.encode({ ...this, variant: 0 }, buffer)
        return buffer.slice(0, this.borshInstructionSchema.getSpan(buffer))
    }

    static deserialize(buffer: Buffer): Movie | null {
        if (!buffer) return null

        try {
            const { title, rating, description } = this.borshAccountShema.decode(buffer)
            return new Movie(title, rating, description)
        } catch (e) {
            return null
        }
    }

    static mocks: Movie[] = [
        new Movie("Interstellar", 4, "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival."),
        new Movie("The Godfather", 5, "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son."),
        new Movie("Matrix", 4, "A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers."),
        new Movie("The Godfather: Part II", 5, "The early life and career of Vito Corleone in 1920s New York City is portrayed while his son, Michael, expands and tightens his grip on the family crime syndicate.")
    ]
}