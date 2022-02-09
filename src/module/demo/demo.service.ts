import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from '../../service/prisma.service';
import { Demo } from '@prisma/client';
import { DemoUpdateDto } from "../../dto/demo/demo.update.dto";
import { DemoCreateDto } from "../../dto/demo/demo.create.dto";



@Injectable()
export class DemoService {

    private readonly logger = new Logger(DemoService.name);

    constructor(private prisma: PrismaService) {
        this.logger.debug("instantiated a new instance of test service");
    }

    /**
     * Creates entity in the datastore
     * 
     * @param demoCreateDto 
     * @returns Demo
     */
    async create(demoCreateDto: DemoCreateDto): Promise<Demo> {
      const data = {
        name: demoCreateDto.name,
        description: demoCreateDto.description,
        deleted: false
      };

      let demo: Demo = await this.prisma.demo.create(
        {
          data
        }
      ) as Demo;
  
      return demo;
    }

    /**
     * Updates entity in the datastore
     * 
     * @param demoUpdateDto 
     * @returns Demo
     */
    async update(demoUpdateDto: DemoUpdateDto): Promise<Demo> {
      const data = {
        name: demoUpdateDto.name,
        description: demoUpdateDto.description,
        deleted: demoUpdateDto.deleted
      };
      let demo: Demo = await this.prisma.demo.update(
        {
          where:
          {
            id: demoUpdateDto.id
          },
          data:
          {
            ...data,
          }
        }
      ) as Demo;
  
      return demo;
    }

    /**
     * Finds all entitis in the datastore
     * 
     * @param id 
     * @param name 
     * @returns array of Demo entities
     */
    async findAll(id: number | null, name: string | null): Promise<Demo[]> {
      let demos: Demo[] = await this.prisma.demo.findMany(
        {
          orderBy: { createdAt: 'desc' },
        }
      ) as Demo[];
      return demos;
    }

    /**
     * Finds entity by the given id
     * 
     * @param id 
     * @returns Demo
     */
    async findById(id:number) : Promise<Demo>{
      // TODO: validate method params
      this.logger.debug(`finding demo in the datastore by demoId[${id}]`);
      let demo: Demo = await this.prisma.demo.findUnique(
        {
          where: {
            id : id,
          }
        }
      ) as Demo;
  
      if(demo) {
        this.logger.debug(`found demo[${JSON.stringify(demo)}] in the datastore by demoId[${id}]`);
      }
      else{
        this.logger.debug(`could not find any demo record in the datastore by demoId[${id}]`);
      }
  
      return demo;
    }

    /**
     * Deletes entity by the given id
     * 
     * @param id 
     * @returns Demo
     */
    async purge(id: number): Promise<Demo> {
      let demo:Demo = await this.prisma.demo.delete(
        { 
          where: 
            { 
              id 
            } 
          }
      ) as Demo;
      return demo;
    }

    /**
     * Sets deleted column to true (soft-delete) for entity by the given id
     * @param id 
     * @returns Demo
     */
    async delete(id: number): Promise<Demo> {
      const data = {
        deleted: true
      };
      let demo: Demo = await this.prisma.demo.update(
        {
          where:
          {
            id: id
          },
          data:
          {
            ...data,
          }
        }
      ) as Demo;
  
      return demo;
    }
    
}