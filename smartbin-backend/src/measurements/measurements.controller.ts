import { Body, Controller, Post } from '@nestjs/common';
import { CreateMeasurementDto } from './dto/measurement.dto';
import { MeasurementsService } from './measurements.service';

@Controller('measurements')
export class MeasurementsController {
    constructor(private readonly service: MeasurementsService) {}

    @Post()
    async receiveMeasurement(@Body() dto: CreateMeasurementDto) {
        console.log('Received measurement:', dto);
        await this.service.saveMeasurement(dto);
        return { status: 'ok' };
    }
}
