import { Injectable } from '@nestjs/common';
import { CreateMeasurementDto } from './dto/measurement.dto';
import { InfluxDB, Point } from '@influxdata/influxdb-client';
import { log } from 'console';
import { ConfigService } from '@nestjs/config';



@Injectable()
export class MeasurementsService {
  private influx: InfluxDB;
  private influxWriteApi;
  private influxQueryApi;
  private bucket;
  private org;

  constructor(private configService: ConfigService) {
    const url = process.env.INFLUX_URL || 'http://localhost:8086'; // URL par défaut si non défini
    const token = process.env.INFLUX_TOKEN || 'my-token';
    this.bucket = process.env.INFLUX_BUCKET;
    this.org = process.env.INFLUX_ORG;
    console.log('Connecting to InfluxDB with URL:', url, 'Bucket:', this.bucket, 'Org:', this.org);

    this.influx = new InfluxDB({url, token});
    this.influxWriteApi = this.influx.getWriteApi(this.org, this.bucket);
    this.influxQueryApi = this.influx.getQueryApi(this.org);
  }

  async saveMeasurement(data: CreateMeasurementDto) {
    const point = new Point('smartbin_measurements')
      .tag('device_id', data.device_id)
      .floatField('fill_level', data.fill_level)
      .floatField('battery_level', data.battery)
      .timestamp(new Date(data.timestamp));
    this.influxWriteApi.writePoint(point);
    await this.influxWriteApi.flush();
    log('Measurement saved:', data);
  }

  async getAllMeasurements() {
    const fluxQuery = `
      from(bucket: "data")
      |> range(start: 0)
      |> filter(fn: (r) => r["_measurement"] == "smartbin_measurements")
      |> pivot(rowKey:["_time"], columnKey: ["_field"], valueColumn: "_value")
      |> keep(columns: ["_time", "device_id", "fill_level", "battery_level"])
    `;

    const result: CreateMeasurementDto[] = [];
    return new Promise((resolve, reject) => {
      this.influxQueryApi.queryRows(fluxQuery, {
        next: (row, tableMeta) => {
          const o = tableMeta.toObject(row);
          try {
            result.push({
              device_id: o.device_id,
              fill_level: Number(o.fill_level),
              battery: Number(o.battery_level),
              timestamp: o._time,
            });
          } catch (e) {
            console.error("Erreur lors du parsing d'une ligne:", e, o);
          }
        },
        error: (error) => {
          console.error('Erreur dans queryRows:', error);
          reject(error);
        },
        complete: () => {
          resolve(result);
        },
      });
    });
  }
}