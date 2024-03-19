import OpenAI from 'openai';

interface Options {
  text: string;
}

export const purchaseReceiptHeaderFromTextUseCase = async (
  openai: OpenAI,
  { text }: Options,
) => {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `
    			Se te va a proporcionar una transcripción de la cabecera de un albarán de compra
    		`,
        },
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: `Necesito obtener la información del albarán sin explicaciones adicionales en el siguiente formato json:
							{
								"albaran": string, // Número de albarán del proveedor
								"pedido": string, // Número de pedido del cliente con patrón PCOXX-XXXX
								"descripcion": string, // Breve descripción de los productos del albarán
							}
							`,
            },
            {
              type: 'text',
              text,
            },
          ],
        },
      ],
      max_tokens: 2000,
      temperature: 0.1,
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
