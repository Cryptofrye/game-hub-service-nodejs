import { Test } from '@nestjs/testing';
import { getModelToken, SequelizeModule } from '@nestjs/sequelize';
import { AccountService } from './account.service';
import { AccountEntity, AccountProps } from '../entities/account.entity';
import { Sequelize } from "sequelize-typescript";
import { notNull } from 'jest-mock-extended';
import { Logger } from "@nestjs/common";


const logger = new Logger(AccountService.name + ".sqllite.spec");

const accountXWGT = {
  id: 1,
  name: "XWGT Account",
  address: "",
  privateKey: "ASDAWAWQE!3432#",
  publicKey: "ASDAWAWQE23423ASDA",
  userId: 1,
  assetId: 1,
  balance: 25,
  //createdAt: new Date("2022-03-21T18:16:07.000Z"),
  //updatedAt: new Date("2022-03-22T09:48:06.000Z"),
  description: "XWGT account",
  enabled: true,
  deleted: false
};

describe('AccountService', () => {
  let service: AccountService;
  let model: typeof AccountEntity;
  let mockedSequelize: Sequelize;


  beforeEach(async () => {
    mockedSequelize = new Sequelize({
      database: 'wodo_account_test',
      dialect: 'mysql',
      username: 'root',
      password: '',
      validateOnly: true,
      logging: logger.debug,
      models: [AccountEntity],
    });
    const modRef = await Test.createTestingModule({
      imports: [
        SequelizeModule.forRoot({
          dialect: 'sqlite',
          database: 'wodo_account_test',
          username: 'root',
          password: '',
          autoLoadModels: true,
          logging: logger.debug,
          models: [AccountEntity]}),
      SequelizeModule.forFeature([AccountEntity]),
      ],
      providers: [
        AccountService,
      ]
    }).compile();
    service = modRef.get(AccountService);
  });

  it('should add an account', async () => {
    let accountEntity = await service.create({ ...accountXWGT });
    notNull(accountEntity);
    notNull(accountEntity.createdAt);
    notNull(accountEntity.updatedAt)
    notNull(accountEntity.version)
    expect(accountEntity.name).toEqual(accountXWGT.name);
  });

 /* it('should get the accounts', async () => {
    expect(await service.findAll(null, null)).toEqual([accountXWGT]);
  });

  
  it('should get a single cat', () => {
    const findSpy = jest.spyOn(model, 'findOne');
    expect(service.getCat('id'));
    expect(findSpy).toBeCalledWith({ where: { id: 'id' } });
  });

  it('should remove a cat', async () => {
    const destroyStub = jest.fn();
    const findSpy = jest.spyOn(model, 'findOne').mockReturnValue({
      destroy: destroyStub,
    } as any);
    const retVal = await service.removeCat('id');
    expect(findSpy).toBeCalledWith({ where: { id: 'id' } });
    expect(destroyStub).toBeCalledTimes(1);
    expect(retVal).toBeUndefined();
  });*/
});