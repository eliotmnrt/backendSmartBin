import { Injectable } from '@nestjs/common';
import { CreateMeasurementDto } from './dto/measurement.dto';
import { InfluxDBClient, Point } from '@influxdata/influxdb3-client';


@Injectable()
export class MeasurementsService {
  private influx: InfluxDBClient;

  constructor() {
    const url = 'http://localhost:8086';
    const token = 'my-super-token-for-smartbin';

    this.influx = new InfluxDBClient({
      host: url,
      token: token,
      database: 'smartbin_data', // plus de notion de org/bucket séparé
    });
  }

  async saveMeasurement(data: CreateMeasurementDto) {
    const point = Point.measurement('smartbin_measurements')
      .setTag('device_id', data.device_id)
      .setFloatField('fill_level', data.fill_level)
      .setFloatField('battery_level', data.battery)
      .setTimestamp(new Date(data.timestamp));
    await this.influx.write(point, 'smartbin_data', 'smartbin-org');
  }
}