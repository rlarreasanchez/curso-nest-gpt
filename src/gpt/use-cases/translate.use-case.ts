import OpenAI from 'openai';

export const translateUseCase = async (openai: OpenAI, { prompt, lang }) => {
  const response = await openai.chat.completions.create({
    messages: [
      {
        role: 'system',
        content: `
					Traduce el siguiente texto al idioma ${lang}:${prompt}
				`,
      },
    ],
    temperature: 0.2,
    // max_tokens: 500,
    model: 'gpt-3.5-turbo',
  });

  return { message: response.choices[0].message.content };
};
