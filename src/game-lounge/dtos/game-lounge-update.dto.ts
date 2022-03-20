import { GameLoungeStateEnum } from "./game-lounge-state.enum";
import { GameLoungeTypeEnum } from "./game-lounge-type.enum";

export default interface GameLoungeUpdateDto {
    type: GameLoungeTypeEnum;
    state: GameLoungeStateEnum;
    gameId: number;
    assetId: number;
    rules: string;
    fee: number;
    prize: number;
    duration: number;
    deleted: boolean;
}