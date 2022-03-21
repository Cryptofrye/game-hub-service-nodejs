import { GameHubUser } from "src/common/constants/game-hub-user";

export class GameLoungeUserDto {

    id!: number;
    gameLoungeId!: number;
    user!: GameHubUser;
}