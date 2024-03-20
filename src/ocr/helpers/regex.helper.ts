export const getRegexPedido = (ocrText: string): string | null => {
  const found = ocrText.match(/PC[0,O]\d{2}-\d{4}/);
  return found ? found[0].replace('PC0', 'PCO') : null;
};
