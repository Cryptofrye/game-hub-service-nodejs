import { Column, Model, PrimaryKey, Table } from 'sequelize-typescript';


export interface CreateAccountProps {
    uid?: string;
    name: string;
    description: string;
    userId: number;
    assetId: number;
    balance: number;
    enabled: boolean;
    deleted: boolean;
}

export interface UpdateAccountProps extends CreateAccountProps {
   
}

export interface AccountProps extends UpdateAccountProps {
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
}

@Table({ tableName: "ACCOUNT", version: true, timestamps: true, paranoid:true ,deletedAt: true, omitNull: true })
export class AccountEntity extends Model {

    @PrimaryKey
    @Column({allowNull:false})
    uid!: string;

    @Column({allowNull:false})
    name!: string;

    @Column({allowNull:true})
    description!: string;

    @Column({allowNull:false})
    userId!: number;

    @Column({allowNull:false})
    assetId!: number;

    @Column({allowNull:true})
    address!: string;

    @Column({allowNull:true})
    privateKey!: string;

    @Column({allowNull:true})
    publicKey!: string;

    @Column({allowNull:false})
    balance!: number;
   
    @Column({defaultValue:true, allowNull:false})
    enabled!: boolean;

    @Column({ allowNull:false, defaultValue: false })
    deleted!: boolean;
}