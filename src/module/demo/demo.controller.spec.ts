import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../service/prisma.service';
import { DemoController } from './demo.controller';
import { DemoService } from './demo.service';
import { mockDeep } from 'jest-mock-extended'
import { Demo } from '.prisma/client';

describe("DemoController", () => {

    var demoModuleRef : TestingModule;
    let demoController:DemoController;
    let demoService:DemoService;
    let prismaService;

    beforeAll(async () => {
        prismaService = mockDeep<PrismaService>();

        // define a Nest custom value provider: https://docs.nestjs.com/fundamentals/custom-providers
        let PrismaServiceProvider = {
            provide: PrismaService,
            useValue: prismaService
          };

        demoModuleRef = await Test.createTestingModule({
            controllers: [DemoController],
            providers: [String,DemoService, PrismaServiceProvider],
        }).compile();
    });

    beforeEach(async () => {
        demoService = demoModuleRef.get<DemoService>(DemoService);
        prismaService = demoModuleRef.get<PrismaService>(PrismaService);
        demoController = demoModuleRef.get<DemoController>(DemoController)
    });

    describe('findAll', () => {
        it('should return an array of demos', async () => {
          const demo: Demo = {
            id: 1,
            name: "Tesst Record",
            deleted: false,
            description: "test demo record",
            createdAt: new Date(),
            updatedAt: new Date()
          };

          let result:Demo[] = [demo];

          prismaService.demo.findMany.mockResolvedValue(result);

          // since PrismaService is mocked, both controller and respective service class is tested here.
          // No need to mock service class methods
          //jest.spyOn(demoController, 'findAll').mockImplementation(() => result);
    
          expect(await demoController.findAll()).toBe(result);
        });
      });
});