import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR, RouterModule } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DemoModule } from './module/demo/demo.module';
import { WPErrorsInterceptor } from '@wodo-platform/wp-shared-lib/dist/wodoplatform/error/wp.errors.interceptor'


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
    DemoModule,
    RouterModule.register([
      {
        path: 'api',
        module: DemoModule
      },
    ]),
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: WPErrorsInterceptor,
    }, AppService],
})
export class AppModule {}
