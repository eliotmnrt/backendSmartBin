import { IsNumber, IsString, IsISO8601, IsOptional } from 'class-validator';

export class CreateMeasurementDto {
  @IsString()
  device_id: string;

  @IsNumber()
  fill_level: number;

  @IsNumber()
  battery: number;

  @IsISO8601()
  timestamp: string;
}
