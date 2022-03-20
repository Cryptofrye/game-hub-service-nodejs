export class GameLoungeState  {
    state!: number;
    name!: string;
    description!: string;
}




export var GAME_LOUNGE_STATE_INITIALIZED:GameLoungeState = {state:1, name:"INITIALIZED", description:"Gaming lounge is initialized, awaiting users to join"}, 
GAME_LOUNGE_STATE_AWAIT:GameLoungeState = {state:2, name:"AWAIT", description:"User(s) joined the gaming lounge, awaiting game kick off"},
GAME_LOUNGE_STATE_INGAME:GameLoungeState = {state:3, name:"IN-GAME", description:"Game started. Users play the game"},
GAME_LOUNGE_STATE_POSTGAME:GameLoungeState = {state:4, name:"POST-GAME", description:"Game finished. Users returned the gaming lounge"},
GAME_LOUNGE_STATE_CLOSED:GameLoungeState = {state:5, name:"CLOSED", description:"Gaming lounge has been closed."};

export var GAME_LOUNGE_STATE_LIST:Array<GameLoungeState> = new Array(GAME_LOUNGE_STATE_INITIALIZED,GAME_LOUNGE_STATE_AWAIT,
    GAME_LOUNGE_STATE_INGAME,GAME_LOUNGE_STATE_POSTGAME,GAME_LOUNGE_STATE_CLOSED);

export const findGameLoungeBySate = (state:number):GameLoungeState => {
   
    switch (state) {
        case GAME_LOUNGE_STATE_INITIALIZED.state:
            return GAME_LOUNGE_STATE_INITIALIZED;
        case GAME_LOUNGE_STATE_AWAIT.state:
            return GAME_LOUNGE_STATE_AWAIT;
        case GAME_LOUNGE_STATE_INGAME.state:
            return GAME_LOUNGE_STATE_INGAME;
        case GAME_LOUNGE_STATE_POSTGAME.state:
            return GAME_LOUNGE_STATE_POSTGAME; 
        case GAME_LOUNGE_STATE_CLOSED.state:
            return GAME_LOUNGE_STATE_CLOSED;     
        default:
            throw Error(`GameLoungeSate not found by state:${state}`);
    }
};