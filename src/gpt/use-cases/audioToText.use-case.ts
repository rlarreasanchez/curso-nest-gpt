import * as fs from 'fs';
import OpenAI from 'openai';

interface Options {
  prompt?: string;
  audioFile: Express.Multer.File;
}

export const audioToTextUseCase = async (
  openai: OpenAI,
  { prompt = '', audioFile }: Options,
) => {
  const response = await openai.audio.transcriptions.create({
    model: 'whisper-1',
    file: fs.createReadStream(audioFile.path),
    prompt: prompt, // Mismo idioma que el audio
    language: 'es', // Idioma del audio
    // response_format: 'vtt', // srt
    response_format: 'verbose_json',
  });

  return response;
};
