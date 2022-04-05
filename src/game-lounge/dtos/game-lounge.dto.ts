import { Game } from "../../common/constants/game";
import { Asset } from "../../common/constants/asset";
import { GameLoungeState } from "../../common/constants/game-lounge-state";
import { GameLoungeType } from "../../common/constants/game-lounge-type";

export class GameLoungeDto {

    uid!: string;
    type!: GameLoungeType;
    state!: GameLoungeState;
    game!: Game;
    asset!: Asset;
    rules!: string;
    fee!: number;
    prize!: number;
    duration!: number;
    deleted!: boolean;
    createdAt!: Date;
    updatedAt!: Date;
}