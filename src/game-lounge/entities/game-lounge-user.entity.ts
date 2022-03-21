import sequelize from 'sequelize';
import { Column, Model, Table } from 'sequelize-typescript';


export interface CreateGameLoungeUserProps {
    userId: number;
    gameLoungeId: number;
    roleId: number;
}

export interface UpdateGameLoungeUserProps extends CreateGameLoungeUserProps {
    
}

export interface GameLoungeUserProps extends UpdateGameLoungeUserProps {
    joinedAt: Date;
}

@Table({ tableName: "GAME_LOUNGE_USER", version: true, timestamps: true, paranoid:false, omitNull: true})
export class GameLoungeUserEntity extends Model {

    @Column({allowNull:false, unique:"playerGl"})
    userId!: number;

    @Column({allowNull:false, unique:"playerGl"})
    gameLoungeId!: number;

    @Column({allowNull:false})
    roleId!: number;

    @Column({ type: sequelize.DATE, defaultValue: sequelize.NOW, allowNull:false})
    joinedAt!: Date;
}