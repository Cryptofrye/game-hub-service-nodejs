export class GameHubUser {
    id!: number;
    name!: string;
    nickname!: string;
    username!: string;
}

export var home: GameHubUser = { id: 1, name: "Wodo Home", nickname: "wodo", username: "wodo"}, 
serhat: GameHubUser = { id: 2, name: "Serhat TANRIKUT", nickname: "Serhatt", username: "serhat"}, 
bekir:  GameHubUser = { id: 3, name: "Bekir Dag", nickname: "Bekird", username: "bekir"},
burak:  GameHubUser = { id: 4, name: "Burak ", nickname: "Burak", username: "burak"};

export var GAME_HUB_USER_LIST:Array<GameHubUser> = new Array(home, serhat, bekir, burak);

export function fundGameHubUserById(id:number): GameHubUser  {
    for (let i = 0; i < GAME_HUB_USER_LIST.length; i++) {
        let ghUser:GameHubUser =  GAME_HUB_USER_LIST[i]
        if(ghUser.id == id) {
            return ghUser
        };
        
    }
    throw new Error(`GameHubUser could not be found by id:${id}`);
}