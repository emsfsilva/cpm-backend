import * as fs from 'fs';
import * as path from 'path';

export const ASSETS_DIR = path.join(__dirname, 'assets');
// export const ASSETS_DIR = path.join(process.cwd(), 'assets', 'pdf-comunicacao');

const cache = new Map<string, string>();

export function imagemParaBase64(nomeArquivo: string): string {
  if (cache.has(nomeArquivo)) {
    return cache.get(nomeArquivo);
  }

  const caminhoCompleto = path.join(ASSETS_DIR, nomeArquivo);

  if (!fs.existsSync(caminhoCompleto)) {
    throw new Error(
      `Imagem "${nomeArquivo}" não encontrada em ${ASSETS_DIR}. ` +
        `Adicione o arquivo nessa pasta antes de gerar o PDF.`,
    );
  }

  const buffer = fs.readFileSync(caminhoCompleto);
  const extensao = path.extname(caminhoCompleto).replace('.', '') || 'png';
  const dataUrl = `data:image/${extensao};base64,${buffer.toString('base64')}`;

  cache.set(nomeArquivo, dataUrl);
  return dataUrl;
}
