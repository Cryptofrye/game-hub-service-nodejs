import { Test, TestingModule } from '@nestjs/testing';
import { mockDeep } from 'jest-mock-extended'
import { GameLoungeController } from './game-lounge.controller';
import GameLoungeCreateDto from '../dtos/game-lounge-create.dto';
import { GameLoungeStateEnum } from '../dtos/game-lounge-state.enum';
import { GameLoungeTypeEnum } from '../dtos/game-lounge-type.enum';
import {GAMES_SNAKE} from '@wodo-platform/wg-shared-lib/dist/wodogaming/game/game'
import {GamingLoungeType,GAMING_LOUNGE_TYPE_LIST, GAMING_LOUNGE_TYPE_STANDARD} from '@wodo-platform/wg-shared-lib/dist/wodogaming/lounge/gaming.lounge.type'
import {GamingLoungeState,GAMING_LOUNGE_STATE_INITIALIZED,GAMING_LOUNGE_STATE_LIST} from '@wodo-platform/wg-shared-lib/dist/wodogaming/lounge/gaming.lounge.state'
import * as val from '../../common/pipes/validation';
import { ValidationPipe } from '../../common/pipes/validation.pipe';
import { GameLoungeService } from '../services/game-lounge.service';
import GameLoungeUpdateDto from '../dtos/game-lounge-update.dto';
import { GameLoungeEntity, GameLoungeProps } from '../entities/game-lounge.orm.entity';


describe("GameLoungeController", () => {

    var gameLounceModuleRef: TestingModule;
    let gameLoungeController: GameLoungeController;
    let gameLoungeService: GameLoungeService;
    let prismaService;

    beforeAll(async () => {
        //prismaService = mockDeep<PrismaService>();

       // let PrismaServiceProvider = {
       //     provide: PrismaService,
      //      useValue: prismaService
      //  };

      gameLounceModuleRef = await Test.createTestingModule({
            imports: [],
            controllers: [GameLoungeController],
            providers: [String,ValidationPipe,GameLoungeService],
        }).compile();
    });

    beforeEach(async () => {
        gameLoungeService = gameLounceModuleRef.get<GameLoungeService>(GameLoungeService);
        //prismaService = gamingLounceModuleRef.get<PrismaService>(PrismaService);
        gameLoungeController = gameLounceModuleRef.get<GameLoungeController>(GameLoungeController)
    });

    describe('create', () => {
        it('should create a gaming lounge', async () => {
            prismaService.gamingLounge.create.mockResolvedValue(gl);

            let result:GameLoungeEntity | null = await gameLoungeController.create(glDto);

            expect(result);
            expect(result.id).toBe(gl.id);
            expect(result.deleted).toBe(gl.deleted);
            expect(result.duration).toBe(gl.duration);
            expect(result.enterenceFee).toBe(gl.enterenceFee);
            expect(result.gameTypeId).toBe(gl.gameTypeId);
            expect(result.prize).toBe(gl.prize);
            expect(result.state).toBe(gl.state);
            expect(result.type).toBe(gl.type);
            expect(result.updatedAt);
            expect(result.createdAt);
        });
    });

    describe('update', () => {
        it('should update a gaming lounge', async () => {

            prismaService.gamingLounge.update.mockResolvedValue(glUpdated);

            let result:GameLoungeEntity | null = await gameLoungeController.update(glUpdateDto);

            expect(result);
            expect(result.id).toBe(glUpdated.id);
            expect(result.deleted).toBe(glUpdated.deleted);
            expect(result.duration).toBe(glUpdated.duration);
            expect(result.enterenceFee).toBe(glUpdated.enterenceFee);
            expect(result.gameTypeId).toBe(glUpdated.gameTypeId);
            expect(result.prize).toBe(glUpdated.prize);
            expect(result.state).toBe(glUpdated.state);
            expect(result.type).toBe(glUpdated.type);
            expect(result.updatedAt);
            expect(result.createdAt);
        });
    });

    describe('findById', () => {
        it('should return a gaming lounge found by id', async () => {

            prismaService.gamingLounge.findUnique.mockResolvedValue(gl);

            let result:GameLoungeEntity | null = await gameLoungeController.findById(1);

            if(result === null) {
                expect(result);
            }
            else{
                expect(result.id).toBe(gl.id);
                expect(result.deleted).toBe(gl.deleted);
                expect(result.duration).toBe(gl.duration);
                expect(result.enterenceFee).toBe(gl.enterenceFee);
                expect(result.gameTypeId).toBe(gl.gameTypeId);
                expect(result.prize).toBe(gl.prize);
                expect(result.state).toBe(gl.state);
                expect(result.type).toBe(gl.type);
                expect(result.updatedAt);
                expect(result.createdAt);
            }
           
        });
    });
});

// ---- mock objects

const glDto: GameLoungeCreateDto = {
    type: GameLoungeTypeEnum.STANDARD.valueOf(),
    state: GameLoungeStateEnum.INITIALIZED.valueOf(),
    gameTypeId: GAMES_SNAKE.id,
    assetId: 1,
    enterenceFee: 2000,
    prize: 10000,
    duration: 3600,
};

const glUpdateDto: GameLoungeUpdateDto = {
    id:1,
    type: GameLoungeTypeEnum.STANDARD.valueOf(),
    state: GameLoungeStateEnum.INITIALIZED.valueOf(),
    gameTypeId: GAMES_SNAKE.id,
    assetId: 1,
    enterenceFee: 2000,
    prize: 10000,
    duration: 3600,
    deleted:false
};

const glUpdated: GameLoungeProps = {
    id:1,
    type: GAMING_LOUNGE_TYPE_STANDARD.id,
    state: GAMING_LOUNGE_STATE_INITIALIZED.id,
    gameTypeId: GAMES_SNAKE.id,
    assetId: 1,
    enterenceFee: 4000,
    prize: 20000,
    duration: 4600,
    deleted:false,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: new Date()
};

const gl: GameLoungeProps = {
    id:1,
    type: GAMING_LOUNGE_TYPE_STANDARD.id,
    state: GAMING_LOUNGE_STATE_INITIALIZED.id,
    gameTypeId: GAMES_SNAKE.id,
    assetId: 1,
    enterenceFee: 2000,
    prize: 10000,
    duration: 3600,
    deleted:false,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: new Date()
};