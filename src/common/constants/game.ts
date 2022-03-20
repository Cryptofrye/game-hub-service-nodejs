export class Game  {
    id!: number;
    name!: string;
    description!: string;
}

export const GAME_WODOLAND: Game = { id:1, name: "Wodoland", description: "A mysterious world wtih lost of surprises" };
export const GAME_AGOR_IO: Game = { id:2, name: "Agar.io", description: "Bubble party" };
export const GAME_SANKE_IO: Game = { id:3, name: "Sanke.io", description: "Getting longer all day" };

export const findGameById = (id:number):Game => {
   
    switch (id) {
        case GAME_WODOLAND.id:
            return GAME_WODOLAND;
        case GAME_AGOR_IO.id:
            return GAME_AGOR_IO;
        case GAME_SANKE_IO.id:
            return GAME_SANKE_IO;      
        default:
            throw Error(`Game not found by id:${id}`);
    }
};

export const findGameByName = (name:string):Game => {
   
    switch (name) {
        case GAME_WODOLAND.name:
            return GAME_WODOLAND;
        case GAME_AGOR_IO.name:
            return GAME_AGOR_IO;
        case GAME_SANKE_IO.name:
            return GAME_SANKE_IO;      
        default:
            throw Error(`Game not found by name:${name}`);
    }
};