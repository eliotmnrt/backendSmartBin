import { Body, Controller, Get, Post } from '@nestjs/common';
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

    @Get()
    async getMeasurements() {
        console.log('Fetching all measurements');
        const measurements = await this.service.getAllMeasurements();
        return measurements;
    }
}
