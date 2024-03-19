import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional } from 'class-validator';

export class PurchaseReceiptDto {
  @IsBoolean()
  @IsOptional()
  @Transform(
    ({ obj, key }) =>
      obj[key] === 'true' ||
      obj[key] === true ||
      obj[key] === '1' ||
      obj[key] === 1,
  )
  readonly withIA: boolean;
}
