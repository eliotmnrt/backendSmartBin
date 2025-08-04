import { IsNumber, IsString, IsISO8601, IsOptional } from 'class-validator';

export class CreateTrashInfosDto {
  @IsString()
  device_id: string;

  @IsNumber()
  type: string;

  @IsNumber()
  quantity: number;

  @IsISO8601()
  timestamp: string;
}
