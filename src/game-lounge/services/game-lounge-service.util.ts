import {GameLoungeCreateDto} from "../dtos/game-lounge-create.dto";

export class GameLoungeServiceUtil {

    public static validateGLCreatinData(data:GameLoungeCreateDto) {
        if(data) {
            throw new Error();
        }
    }
}