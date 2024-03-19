import { Injectable, NotFoundException } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';

import OpenAI from 'openai';

import {
  audioToTextUseCase,
  employeeCheckUseCase,
  imageGenerationUseCase,
  imageVariationUseCase,
  ortographyCheckUseCase,
  prosConsDiscusserStreamUseCase,
  prosConsDiscusserUseCase,
  purchaseReceiptHeaderFromTextUseCase,
  textToAudioUseCase,
  translateUseCase,
} from './use-cases';
import {
  AudioToTextDto,
  ImageGenerationDto,
  ImageVariationDto,
  OrtographyDto,
  ProsConsDiscusserDto,
  TextToAudioDto,
  TranslateDto,
} from './dtos';
import { PurchaseReceipt } from 'src/common/interfaces/index';

@Injectable()
export class GptService {
  private openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  async ortographyCheck(ortographyDto: OrtographyDto): Promise<any> {
    return await ortographyCheckUseCase(this.openai, {
      prompt: ortographyDto.prompt,
    });
  }

  async prosConsDicusser(
    prosConsDiscusserDto: ProsConsDiscusserDto,
  ): Promise<any> {
    return await prosConsDiscusserUseCase(this.openai, {
      prompt: prosConsDiscusserDto.prompt,
    });
  }

  async prosConsDicusserStream(
    prosConsDiscusserDto: ProsConsDiscusserDto,
  ): Promise<any> {
    return await prosConsDiscusserStreamUseCase(this.openai, {
      prompt: prosConsDiscusserDto.prompt,
    });
  }

  async translate(translateDto: TranslateDto): Promise<any> {
    return await translateUseCase(this.openai, {
      prompt: translateDto.prompt,
      lang: translateDto.lang,
    });
  }

  async textToAudio({ prompt, voice }: TextToAudioDto): Promise<any> {
    return await textToAudioUseCase(this.openai, {
      prompt,
      voice,
    });
  }

  async textToAudioGetter(fileId: string): Promise<any> {
    const filePath = path.resolve(
      __dirname,
      '../../generated/audios/',
      `${fileId}.mp3`,
    );

    const fileExists = fs.existsSync(filePath);

    if (!fileExists) throw new NotFoundException(`File ${fileId} not found`);

    return filePath;
  }

  async audioToText(
    audioFile: Express.Multer.File,
    audioToTextDto: AudioToTextDto,
  ) {
    return await audioToTextUseCase(this.openai, {
      audioFile,
      prompt: audioToTextDto.prompt,
    });
  }

  async imageGeneration(imageGenerationDto: ImageGenerationDto) {
    return await imageGenerationUseCase(this.openai, { ...imageGenerationDto });
  }

  imageGenerationGetter(filename: string) {
    const filePath = path.resolve(
      __dirname,
      '../../generated/images/',
      `${filename}`,
    );

    const fileExists = fs.existsSync(filePath);

    if (!fileExists) throw new NotFoundException(`File ${filename} not found`);

    return filePath;
  }

  async imageVariation({ baseImage }: ImageVariationDto) {
    return await imageVariationUseCase(this.openai, { baseImage });
  }

  async purchaseReceiptHeaderFromText(text: string): Promise<PurchaseReceipt> {
    return await purchaseReceiptHeaderFromTextUseCase(this.openai, { text });
  }

  async employeeCheck({ file }: { file: Express.Multer.File }): Promise<any> {
    return await employeeCheckUseCase(this.openai, {
      file,
    });
  }
}
