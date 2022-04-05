import sequelize from 'sequelize';
import { Column, Model, PrimaryKey, Table } from 'sequelize-typescript';
import { STRING} from 'sequelize/types';


export interface CreateGameLoungeUserProps {
    uid?: string;
    userId: number;
    gameLoungeId: string;
    roleId: number;
}

export interface UpdateGameLoungeUserProps extends CreateGameLoungeUserProps {
    
}

export interface GameLoungeUserProps extends UpdateGameLoungeUserProps {
    joinedAt: Date;
}

@Table({ tableName: "GAME_LOUNGE_USER", version: true, timestamps: true, paranoid:false, omitNull: true})
export class GameLoungeUserEntity extends Model {

    @PrimaryKey
    @Column({allowNull:false})
    uid!: string;

    @Column({allowNull:false, unique:"playerGl"})
    userId!: number;

    @Column({allowNull:false, unique:"playerGl"})
    gameLoungeId!: string;

    @Column({allowNull:false})
    roleId!: number;

    @Column({ type: sequelize.DATE, defaultValue: sequelize.NOW, allowNull:false})
    joinedAt!: Date;
}