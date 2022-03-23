import { AccountEntity } from "src/wallet/entities/account.entity";
import WodoEvent from "./event.interface";
import { Transaction } from "sequelize";

export const EVENT_NAMESPACE_WALLET:string = "wallet"

export class WithdrawAssetPayload {
    userId!: number;
    accountId!: number | null;
    assetId!: number;
    fee!:number; 
    t!:Transaction | null;
}

export class WithdrawAssetInitiatedEvent implements WodoEvent {

    static event_namespace: string = EVENT_NAMESPACE_WALLET; 
    static event_eventType: string = "WwthdrawAssetInitiated";

    namespace: string = WithdrawAssetInitiatedEvent.event_namespace; 
    eventType: string = WithdrawAssetInitiatedEvent.event_eventType;
    payload!: WithdrawAssetPayload;

    static toEventId():string {
        return `${this.event_namespace}.${this.event_eventType}`;
    }
}





