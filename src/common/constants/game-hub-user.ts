export class GameHubUser {
    id!: number;
    name!: string;
    nickname!: string;
    username!: string;
}

export var serhat: GameHubUser = { id: 1, name: "Serhat TANRIKUT", nickname: "Serhatt", username: "serhat"}, 
bekir:  GameHubUser = { id: 2, name: "Bekir Dag", nickname: "Bekird", username: "bekir"},
tarik:  GameHubUser = { id: 3, name: "Tarik Alhafız", nickname: "Tarika", username: "tarik"};

export var GAME_HUB_USER_LIST:Array<GameHubUser> = new Array(serhat, bekir, tarik);

export function fundGameHubUserById(id:number): GameHubUser  {
    for (let i = 0; i < GAME_HUB_USER_LIST.length; i++) {
        let ghUser:GameHubUser =  GAME_HUB_USER_LIST[i]
        if(ghUser.id == id) {
            return ghUser
        };
        
    }
    throw new Error(`GameHubUser could not be found by id:${id}`);
}