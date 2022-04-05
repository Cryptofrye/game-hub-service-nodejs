export class Asset  {
    id!: number;
    name!: string;
    symbol!: string;
    description!: string;
}

export const ASSET_XWGT: Asset = { id:1, name: "Wodo Gaming Token", symbol : "XWGT", description: "Fundamental token for wodo gameing platform" };
export const ASSET_NANO: Asset = { id:2, name: "Nano Coin", symbol : "XNO", description: "Nano blockchain token" };
export const ASSET_BANANO: Asset = { id:3, name: "Banano coin", symbol : "BAN", description: "Banano blockchain token" };
export const ASSET_LIST = [ASSET_XWGT, ASSET_NANO, ASSET_BANANO];

export const findAssetById = (id:number):Asset => {
   
    switch (id) {
        case ASSET_XWGT.id:
            return ASSET_XWGT;
        case ASSET_NANO.id:
            return ASSET_NANO;
        case ASSET_BANANO.id:
            return ASSET_BANANO;      
        default:
            throw Error(`asset not found by uid:${id}`);
    }
};

export const findAssetBySymbol = (symbol:string):Asset => {
   
    switch (symbol) {
        case ASSET_XWGT.name:
            return ASSET_XWGT;
        case ASSET_NANO.name:
            return ASSET_NANO;
        case ASSET_BANANO.name:
            return ASSET_BANANO;      
        default:
            throw Error(`asset not found by symbol:${symbol}`);
    }
};