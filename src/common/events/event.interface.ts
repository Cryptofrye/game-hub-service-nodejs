export default interface WodoEvent {
    namespace:string,
    eventType:string,
} 

export const BLOCKCHAIN_TRANSACTION_RECEIVED : WodoEvent = {
    namespace : "blockchain",
    eventType : "blockhain_transaction_received"
}
 