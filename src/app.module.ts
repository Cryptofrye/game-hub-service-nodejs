import { ScheduleModule } from '@nestjs/schedule';
import { CacheModule, Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { SequelizeModule } from '@nestjs/sequelize';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RouterModule, Routes, RouteTree } from '@nestjs/core';
import { GameLoungeModule } from './game-lounge/game-lounge.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ErrorsInterceptor } from '@wodo-platform/wg-shared-lib/dist/wodogaming/error/errors.interceptor';
import { LoggerModule } from 'nestjs-pino';
import { GameLoungeEntity } from './game-lounge/entities/game-lounge.orm.entity';

@Module({
  imports: [
    LoggerModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CacheModule.register({
      isGlobal: true,
    }),
    EventEmitterModule.forRoot({
      // set this to `true` to use wildcards
      wildcard: true,
      // the delimiter used to segment namespaces
      delimiter: '.',
      // set this to `true` if you want to emit the newListener event
      newListener: true,
      // set this to `true` if you want to emit the removeListener event
      removeListener: true,
      // the maximum amount of listeners that can be assigned to an event
      maxListeners: 20,
      // show event name in memory leak message when more than maximum amount of listeners is assigned
      verboseMemoryLeak: true,
      // disable throwing uncaughtException if an error event is emitted and it has no listeners
      ignoreErrors: false,
    }),
    ScheduleModule.forRoot(),
    SequelizeModule.forRoot({
      dialect: 'mysql',
      host: String(process.env.MYSQLDB_HOST).toString(),
      port: Number(process.env.MYSQLDB_LOCAL_PORT).valueOf(),
      username: String(process.env.MYSQLDB_WODO_USER).toString(),
      password: String(process.env.MYSQLDB_WODO_PASSWORD).toString(),
      database: String(process.env.MYSQLDB_WODO_DATABASE).toString(),
      autoLoadModels: true,
      synchronize: true,
      logging: console.log
    }),
   // NotificationModule,
    //GameServerModule,
    GameLoungeModule,
    RouterModule.register([ 
     /* {
        path: 'api',
        module: GameServerModule
      } as RouteTree, */
      {
        path: 'api',
        module: GameLoungeModule
      } as RouteTree,
      ,
      /* {
        path: 'api',
        module: GamingOrchestratorModule
      } as RouteTree,*/
    ] as Routes),
  ],
  controllers: [
    AppController
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ErrorsInterceptor,
    }, 
    AppService
  ]
})
export class ApplicationModule {}
