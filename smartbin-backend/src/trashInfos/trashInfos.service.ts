import { Injectable } from '@nestjs/common';
import { CreateTrashInfosDto } from './dto/trashInfos.dto';
import { InfluxDB, Point } from '@influxdata/influxdb-client';
import { log } from 'console';
import { ConfigService } from '@nestjs/config';



@Injectable()
export class TrashInfosService {
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

  async saveTrashInfos(data: CreateTrashInfosDto) {
    const point = new Point('smartbin_trashInfos')
      .tag('device_id', data.device_id)
      .stringField('type', data.type)
      .floatField('quantity', data.quantity)
      .timestamp(new Date(data.timestamp));
    this.influxWriteApi.writePoint(point);
    await this.influxWriteApi.flush();
    log('TrashInfos saved:', data);
  }

  async getAllTrashInfos() {
    const fluxQuery = `
      from(bucket: "data")
      |> range(start: 0)
      |> filter(fn: (r) => r["_measurement"] == "smartbin_trashInfos")
      |> pivot(rowKey:["_time"], columnKey: ["_field"], valueColumn: "_value")
      |> keep(columns: ["_time", "device_id", "type", "quantity"])
    `;

    const result: CreateTrashInfosDto[] = [];
    return new Promise((resolve, reject) => {
      this.influxQueryApi.queryRows(fluxQuery, {
        next: (row, tableMeta) => {
          const o = tableMeta.toObject(row);
          try {
            result.push({
              device_id: o.device_id,
              type: o.type,
              quantity: Number(o.quantity),
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