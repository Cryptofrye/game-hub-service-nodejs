import { GameHubUser } from "src/common/constants/game-hub-user";

export class GameLoungeUserDto {

    uid!: string;
    gameLoungeId!: string;
    user!: GameHubUser;
}