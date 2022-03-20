export class GameLoungeCreateDto {
    type!: number;
    state!: number;
    gameId!: number;
    assetId!: number;
    rules!: string;
    fee!: number;
    prize!: number;
    duration!: number;
}