import { Injectable } from '@nestjs/common';

import OpenAI from 'openai';

import {
  ortographyCheckUseCase,
  prosConsDiscusserStreamUseCase,
  prosConsDiscusserUseCase,
} from './use-cases';
import { OrtographyDto, ProsConsDiscusserDto } from './dtos';

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
}
