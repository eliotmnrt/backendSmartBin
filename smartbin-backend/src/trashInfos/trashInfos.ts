import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateTrashInfosDto } from './dto/trashInfos.dto';
import { TrashInfosService } from './trashInfos.service';

@Controller('trashInfos')
export class TrashInfosController {
    constructor(private readonly service: TrashInfosService) {}

    @Post()
    async receiveTrashInfos(@Body() dto: CreateTrashInfosDto) {
        console.log('Received TrashInfos:', dto);
        await this.service.saveTrashInfos(dto);
        return { status: 'ok' };
    }

    @Get()
    async getTrashInfos() {
        console.log('Fetching all TrashInfos');
        const trashInfos = await this.service.getAllTrashInfos();
        return trashInfos;
    }
}
