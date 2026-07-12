/**
 * Ícones SVG inline (Font Awesome Free 6, licença CC BY 4.0 / MIT).
 * Usados no lugar de emojis Unicode porque emojis dependem de uma fonte de
 * emoji instalada no SO do servidor (ausente em servidores Linux mínimos),
 * enquanto SVG inline não depende de nenhuma fonte ou instalação externa.
 *
 * Cada função aceita um `size` (em px) e uma `color` (hex ou CSS color)
 * opcionais, com valores padrão pensados para o contexto do PDF.
 */

interface IconOptions {
  size?: number;
  color?: string;
}

function svgWrapper(
  viewBox: string,
  path: string,
  { size = 12, color = 'currentColor' }: IconOptions = {},
): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" width="${size}" height="${size}" style="vertical-align:-1px;"><path fill="${color}" d="${path}"/></svg>`;
}

/** fa-user (solid) */
export function iconUser(options?: IconOptions): string {
  return svgWrapper(
    '0 0 448 512',
    'M224 256c70.7 0 128-57.3 128-128S294.7 0 224 0S96 57.3 96 128s57.3 128 128 128zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z',
    options,
  );
}

/** fa-check (solid) */
export function iconCheck(options?: IconOptions): string {
  return svgWrapper(
    '0 0 512 512',
    'M470.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L192 338.7 425.4 105.4c12.5-12.5 32.8-12.5 45.3 0z',
    { color: '#1e824c', ...options },
  );
}

/** fa-school (solid) */
export function iconSchool(options?: IconOptions): string {
  return svgWrapper(
    '0 0 640 512',
    'M337.8 5.4C327-1.8 313-1.8 302.2 5.4l-139 92.7L37.6 126C15.6 130.9 0 150.3 0 172.8V464c0 26.5 21.5 48 48 48H592c26.5 0 48-21.5 48-48V172.8c0-22.5-15.6-42-37.6-46.9L476.8 98.1 337.8 5.4zM256 416c0-35.3 28.7-64 64-64s64 28.7 64 64v96H256V416zM96 192h32c8.8 0 16 7.2 16 16v64c0 8.8-7.2 16-16 16H96c-8.8 0-16-7.2-16-16V208c0-8.8 7.2-16 16-16zm400 16c0-8.8 7.2-16 16-16h32c8.8 0 16 7.2 16 16v64c0 8.8-7.2 16-16 16H512c-8.8 0-16-7.2-16-16V208zM96 320h32c8.8 0 16 7.2 16 16v64c0 8.8-7.2 16-16 16H96c-8.8 0-16-7.2-16-16V336c0-8.8 7.2-16 16-16zm400 16c0-8.8 7.2-16 16-16h32c8.8 0 16 7.2 16 16v64c0 8.8-7.2 16-16 16H512c-8.8 0-16-7.2-16-16V336zM408 176c0 48.6-39.4 88-88 88s-88-39.4-88-88s39.4-88 88-88s88 39.4 88 88zm-88-48c-8.8 0-16 7.2-16 16v32c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16s-7.2-16-16-16H336V144c0-8.8-7.2-16-16-16z',
    options,
  );
}
