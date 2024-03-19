import * as fs from 'fs';
import * as tesseract from 'node-tesseract-ocr';

export const getOcrText = async (
  file: Express.Multer.File,
): Promise<string> => {
  const config = {
    oem: 1,
    psm: 4,
    lang: 'spa',
  };

  try {
    const imgBuffer = fs.readFileSync(file.path);

    if (!imgBuffer) throw new Error('No se ha podido obtener la imagen');

    const responseTesseract = await tesseract
      .recognize(imgBuffer, config)
      .then((text) => {
        return { text };
      })
      .catch((error) => {
        console.log(error.message);
        return null;
      });

    if (!responseTesseract) throw new Error('No se ha podido leer la imagen');

    return responseTesseract.text;
  } catch (error) {
    console.log(error);
    return null;
  }
};
