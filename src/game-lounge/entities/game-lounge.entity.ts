import { Column, Model, NotNull, Table } from 'sequelize-typescript';


export interface CreateGameLoungeProps {
    type: number;
    state: number;
    gameId: number;
    assetId: number;
    rules: string;
    fee: number;
    prize: number;
    duration: number;
    deleted: boolean;
}

export interface UpdateGameLoungeProps extends CreateGameLoungeProps {
    
}

export interface GameLoungeProps extends UpdateGameLoungeProps {
    id:number;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
}

@Table({ tableName: "GAME_LOUNGE", version: true, timestamps: true, paranoid:true ,deletedAt: true, omitNull: true })
export class GameLoungeEntity extends Model {

    @Column({allowNull:false})
    type!: number;

    @Column({allowNull:false})
    state!: number;

    @Column({allowNull:false})
    gameId!: number;

    @Column({allowNull:false})
    assetId!: number;

    @Column({allowNull:false})
    rules!: string;

    @Column({allowNull:false})
    fee!: number;

    @Column({allowNull:false})
    prize!: number;

    @Column({allowNull:false})
    duration!: number;

    @Column({ allowNull:false, defaultValue: false })
    deleted!: boolean;

}