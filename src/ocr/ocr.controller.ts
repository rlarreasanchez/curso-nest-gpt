import {
  Body,
  Controller,
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { diskStorage } from 'multer';

import { OcrService } from './ocr.service';
import { PurchaseReceiptDto } from './dtos';

@Controller('ocr')
export class OcrController {
  constructor(private readonly ocrService: OcrService) {}

  @Post('purchase-receipt')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './generated/uploads',
        filename: (req, file, callback) => {
          const fileExtension = file.originalname.split('.').pop();
          const filename = `${new Date().getTime()}.${fileExtension}`;
          return callback(null, filename);
        },
      }),
    }),
  )
  async purchaseReceiptOcr(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 1024 * 1024 * 6,
            message: 'File is bigger than 6MB',
          }),
          new FileTypeValidator({
            fileType: 'image/*',
          }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Body() purchaseReceiptDto: PurchaseReceiptDto,
  ) {
    return await this.ocrService.purchaseReceiptOcr(file, purchaseReceiptDto);
  }
}
