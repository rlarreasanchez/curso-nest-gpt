import OpenAI from 'openai';
import * as fs from 'fs';

interface Options {
  file: Express.Multer.File;
}

export const employeeCheckUseCase = async (
  openai: OpenAI,
  { file }: Options,
) => {
  try {
    const imageBuffer = fs.readFileSync(file.path);
    if (!imageBuffer) throw new Error('No se ha podido obtener la imagen');

    const image64String = imageBuffer.toString('base64');

    const response = await openai.chat.completions.create({
      model: 'gpt-4-vision-preview',
      messages: [
        {
          role: 'system',
          content: `
    			Se te va a proporcionar una imagen de una persona
    		`,
        },
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: `Necesito obtener la información de la persona como un objeto json sin explicaciones adicionales con la siguiente estructura:
							{
								"tieneCasco": boolean, // Si el trabajador lleva casco
								"tieneChaleco": boolean, // Si el trabajador lleva chaleco
								"tieneBotas": boolean, // Si el trabajador lleva botas
								"tieneGuantes": boolean, // Si el trabajador lleva guantes
								"tieneGafas": boolean, // Si el trabajador lleva gafas de protección individual
								"tieneMascarilla": boolean, // Si el trabajador lleva mascarilla
							}
							`,
            },
            {
              type: 'image_url',
              image_url: {
                url: `data:image/png;base64,${image64String}`,
              },
            },
          ],
        },
      ],
      max_tokens: 3000,
      temperature: 0.3,
    });

    const jsonString = response.choices[0].message.content
      .replace('```json', '')
      .replace('```', '');

    const jsonResp = JSON.parse(jsonString);
    return jsonResp;
  } catch (error) {
    console.log(error);
    return null;
  }
};
