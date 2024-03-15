import { Injectable, NotFoundException } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';

import OpenAI from 'openai';

import {
  ortographyCheckUseCase,
  prosConsDiscusserStreamUseCase,
  prosConsDiscusserUseCase,
  textToAudioUseCase,
  translateUseCase,
} from './use-cases';
import {
  OrtographyDto,
  ProsConsDiscusserDto,
  TextToAudioDto,
  TranslateDto,
} from './dtos';

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
}
