import * as wf from "@temporalio/workflow";
import { CreateGameLoungeUserProps, GameLoungeUserEntity } from "src/game-lounge/entities/game-lounge-user.entity";

import { CreateGameLoungeProps, GameLoungeEntity } from "src/game-lounge/entities/game-lounge.entity";
import { GameLoungeActivityFactory } from "../activities/game-lounge.activities";
import { addUserFlow } from "./game-lounge-add-user-workflow";

export const addUserSignal = wf.defineSignal<[CreateGameLoungeUserProps]>('addUser');
export const removeUserSignal = wf.defineSignal('removeUser');
export const startGameSignal = wf.defineSignal('startGame');
export const finishGameSignal = wf.defineSignal('finishGame');
export const isGameStartedQuery = wf.defineQuery<boolean>('isGameStarted');
export const isGameFinishedQuery = wf.defineQuery<boolean>('isGameFinished');

export const setDeadlineSignal = wf.defineSignal<[number]>('setDeadline');
export const timeLeftQuery = wf.defineQuery<number>('timeLeft');

export const { createGameLounge, addUser, removeUser, startGame, processGameResult, closeGameLaounge } = wf.proxyActivities<ReturnType<typeof GameLoungeActivityFactory>>({
    startToCloseTimeout: "130 seconds",
    retry: { initialInterval: "5s", backoffCoefficient: 2 },
});

export async function gameLoungeFlow(gameLoungeProps: CreateGameLoungeProps): Promise<void> {

    let gameLounge:GameLoungeEntity;
    
    let isGameStarted:boolean = false;
    let isGameFinised:boolean = false;
    let target = Date.now() + 3 * 60 * 1000; // 2 mins!!!
    let timer = new UpdatableTimer(target);
    console.log('game start timer set for: ' + new Date(target).toString());

    wf.setHandler(addUserSignal, async (gameLoungeUser: CreateGameLoungeUserProps):Promise<void> => { 
            //gameLoungeUser.gameLoungeId = 3;
            let result:GameLoungeUserEntity = await addUser(gameLoungeUser);
            console.log(`gameLoungeFlow:add user result:${result}`);
        }
    );

    wf.setHandler(removeUserSignal, async () =>  { console.log("remove User signal") });
    wf.setHandler(startGameSignal, async () =>  { await startGame(); isGameStarted = true});
    wf.setHandler(finishGameSignal, () => void (isGameFinised = true));
    wf.setHandler(isGameStartedQuery, () => isGameStarted);
    wf.setHandler(isGameFinishedQuery, () => isGameFinised);
    wf.setHandler(setDeadlineSignal, (deadline) => {
        // send in new deadlines via Signal
        timer.deadline = deadline;
        console.log('timer now set for: ' + new Date(deadline).toString());
    });

    wf.setHandler(timeLeftQuery, () => timer.deadline - Date.now());

    console.log(`running wokflow gameLoungeFlow with params:${JSON.stringify(gameLoungeProps)}`);
    gameLounge = await createGameLounge(gameLoungeProps);   
    await timer; // if you send in a signal with a new time, this timer will resolve earlier!

    await startGame();

    await wf.condition( () => isGameFinised);

    await processGameResult();
    await closeGameLaounge();
} 


// implementation
export class UpdatableTimer implements PromiseLike<void> {
    deadlineUpdated = false;
    #deadline: number;
    readonly promise: Promise<void>;
  
    constructor(deadline: number) {
      this.#deadline = deadline;
      this.promise = this.run();
      this.promise.catch(() => {
        // avoid unhandled rejection
      });
    }
  
    private async run(): Promise<void> {
      /* eslint-disable no-constant-condition */
      while (true) {
        console.log("UpdatableTimer while loop");
        this.deadlineUpdated = false;
        if (!(await wf.condition( () => this.deadlineUpdated, this.#deadline - Date.now() ))) {
          break;
        }
      }
    }
  
    then<TResult1 = void, TResult2 = never>(
      onfulfilled?: (value: void) => TResult1 | PromiseLike<TResult1>,
      onrejected?: (reason: any) => TResult2 | PromiseLike<TResult2>
    ): PromiseLike<TResult1 | TResult2> {
      return this.promise.then(onfulfilled, onrejected);
    }
  
    set deadline(value: number) {
      this.#deadline = value;
      this.deadlineUpdated = true;
    }
  
    get deadline(): number {
      return this.#deadline;
    }
  }