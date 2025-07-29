import { Injectable } from '@nestjs/common';
import { CreateMeasurementDto } from './dto/measurement.dto';
import { InfluxDB, Point } from '@influxdata/influxdb-client';
import { log } from 'console';


@Injectable()
export class MeasurementsService {
  private influx: InfluxDB;
  private influxWriteApi;
  private influxQueryApi;
  private bucket = 'smartbin_data';
  private org = 'smartbin-org';

  constructor() {
    const url = 'http://localhost:8086';
    const token = 'my-super-token-for-smartbin';

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
      from(bucket: "smartbin_data")
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