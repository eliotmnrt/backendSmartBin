import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MeasurementsModule } from './measurements/measurements.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    MeasurementsModule,
    ConfigModule.forRoot({
      isGlobal: true, // disponible partout
      envFilePath: '.env',
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
