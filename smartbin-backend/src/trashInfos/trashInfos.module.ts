import { Module } from '@nestjs/common';
import { TrashInfosController } from './trashInfos';
import { TrashInfosService } from './trashInfos.service';

@Module({
    controllers: [TrashInfosController],
    providers: [TrashInfosService],
})
export class TrashInfosModule {}
