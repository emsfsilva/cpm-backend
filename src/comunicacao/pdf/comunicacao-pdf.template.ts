import { ComunicacaoEntity } from '../entities/comunicacao.entity';
import { imagemParaBase64 } from './image.util';

// Ajuste para a URL real de verificação de autenticidade do documento
const URL_VERIFICACAO_BASE =
  process.env.URL_VERIFICACAO_COMUNICACAO ??
  'https://atos_cpm.pr.pe.gov.br/verificar';

/** Formata Date | string -> "dd/mm/aaaa, HH:MM:SS" (padrão do modelo) */
function formatarDataHora(data?: Date | string | null): string {
  if (!data) return '-';
  const d = typeof data === 'string' ? new Date(data) : data;
  if (isNaN(d.getTime())) return '-';

  const pad = (n: number) => String(n).padStart(2, '0');
  return (
    `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}, ` +
    `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
  );
}

/**
 * Nome de exibição de um usuário no formato "PG NOMEGUERRA | Papel"
 * (ex: "CB FRANCISCO | Master"), seguindo os campos reais do seu UserEntity.
 */
function nomeExibicao(user: any, papel: string): string {
  if (!user) return '-';
  const pg = user.pg ? `${user.pg} ` : '';
  const nome = user.nomeGuerra ?? user.name ?? '';
  return `${pg}${nome} | ${papel}`;
}

/** Mapeia o status para uma cor de barra, seguindo o padrão do modelo (arquivada = vermelho) */
function corDoStatus(status: string): string {
  const mapa: Record<string, string> = {
    'Comunicação arquivada': '#c0392b',
    'Comunicação publicada': '#1e824c',
    'Aguardando publicação': '#e67e22',
  };
  return mapa[status] ?? '#4a4a4a';
}

interface SecaoParecer {
  numero: string;
  titulo: string;
  autor: any;
  papel: string;
  data: Date | string | null | undefined;
  texto: string | null | undefined;
}

function renderSecaoParecer(secao: SecaoParecer): string {
  if (!secao.autor || !secao.texto) return '';
  return `
    <div class="secao">
      <div class="secao-titulo">${secao.numero} - ${secao.titulo}</div>
      <div class="card">
        <div class="card-header">
          <span class="autor">👤 ${nomeExibicao(
            secao.autor,
            secao.papel,
          )}</span>
          <span class="data">${formatarDataHora(secao.data)}</span>
        </div>
        <div class="campo">
          <span class="campo-label">Parecer:</span>
          <p class="campo-texto italico">${secao.texto}</p>
        </div>
      </div>
    </div>
  `;
}

export async function gerarHtmlComunicacao(
  comunicacao: ComunicacaoEntity,
): Promise<string> {
  const govBrasao = imagemParaBase64('govpesei.png');
  const logo = imagemParaBase64('logo.png');

  const aluno = comunicacao.useral as any;
  const turma = aluno?.aluno?.turma;
  const cia = turma?.cia;

  const responsavel1 = aluno?.aluno?.responsavel1;
  const responsavel2 = aluno?.aluno?.responsavel2;

  const blocoResponsaveis = [
    responsavel1
      ? `<span class="responsavel">👤 ${
          responsavel1.pg ? responsavel1.pg + ' ' : ''
        }${responsavel1.name} ${
          comunicacao.dataCienciaResponsavel1 ? '✅' : ''
        }</span>`
      : '',
    responsavel2
      ? `<span class="responsavel">👤 ${
          responsavel2.pg ? responsavel2.pg + ' ' : ''
        }${responsavel2.name} ${
          comunicacao.dataCienciaResponsavel2 ? '✅' : ''
        }</span>`
      : '',
  ]
    .filter(Boolean)
    .join('');

  const blocoArquivamento = comunicacao.userarquivador
    ? `<p class="arquivamento">
         Comunicação arquivada por <strong>${
           comunicacao.userarquivador['name'] ??
           comunicacao.userarquivador['login'] ??
           ''
         }</strong> em ${formatarDataHora(comunicacao.dtAtualizacaoStatus)}
       </p>`
    : '';

  return `
  <!DOCTYPE html>
  <html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <style>
      * { box-sizing: border-box; }
      body {
        font-family: 'Helvetica', Arial, sans-serif;
        color: #2b2b2b;
        font-size: 11px;
        margin: 0;
        padding: 0;
      }
      .cabecalho {
        text-align: center;
        margin-bottom: 16px;
      }
      .cabecalho img.brasao {
        height: 60px;
        display: block;
        margin: 0 auto 6px auto;
      }
      .cabecalho h1 {
        font-size: 15px;
        margin: 2px 0;
      }
      .cabecalho h2 {
        font-size: 12px;
        font-weight: normal;
        margin: 0;
        color: #555;
      }
      .info-comunicacao {
        margin-bottom: 14px;
      }
      .info-comunicacao .numero {
        font-weight: bold;
        font-size: 12px;
      }
      .info-comunicacao .linha {
        margin-top: 2px;
      }
      .secao-titulo {
        font-weight: bold;
        font-size: 11.5px;
        margin: 14px 0 6px 0;
        border-bottom: 1px solid #ddd;
        padding-bottom: 2px;
      }
      .card {
        border: 1px solid #e0e0e0;
        border-radius: 4px;
        padding: 10px 12px;
        background: #fafafa;
      }
      .card-header {
        display: flex;
        justify-content: space-between;
        font-weight: bold;
        font-size: 11px;
        margin-bottom: 6px;
      }
      .card-header .data {
        font-weight: normal;
        color: #666;
      }
      .campo {
        margin-top: 6px;
      }
      .campo-label {
        font-weight: bold;
      }
      .campo-texto {
        margin: 2px 0 0 0;
      }
      .italico {
        font-style: italic;
        color: #333;
      }
      .responsaveis {
        margin-top: 8px;
        display: flex;
        gap: 14px;
        justify-content: flex-end;
        font-size: 10.5px;
      }
      .assinatura {
        text-align: center;
        margin-top: 40px;
      }
      .assinatura .nome-comandante {
        font-weight: bold;
        font-size: 11px;
      }
      .assinatura .cargo-comandante {
        font-size: 10.5px;
        color: #444;
      }
      .assinatura img.logo {
        height: 55px;
        display: block;
        margin: 8px auto 0 auto;
      }
      .arquivamento {
        margin-top: 18px;
        font-size: 10.5px;
        color: #444;
      }
      .rodape-autenticidade {
        margin-top: 18px;
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 9px;
        color: #666;
      }
      .rodape-autenticidade img {
        width: 55px;
        height: 55px;
      }
      .barra-status {
        margin-top: 16px;
        background: ${corDoStatus(comunicacao.status)};
        color: #fff;
        text-align: right;
        padding: 6px 12px;
        font-size: 10.5px;
        font-weight: bold;
      }
    </style>
  </head>
  <body>

    <div class="cabecalho">
      <img class="brasao" src="${govBrasao}" alt="Brasão" />
      <h1>Colégio da Polícia Militar - CPM</h1>
      <h2>Corpo de Alunos</h2>
    </div>

    <div class="info-comunicacao">
      <div class="numero">Comunicação nº: ${String(comunicacao.id).padStart(
        2,
        '0',
      )}</div>
      <div class="linha">👤 ${aluno?.name ?? '-'}</div>
      <div class="linha">🏫 Turma: ${turma?.name ?? '-'} | ${
    cia?.name ?? 'Sem CIA'
  }</div>
    </div>

    <div class="secao-titulo">I - Comunicação</div>
    <div class="card">
      <div class="card-header">
        <span>👤 ${nomeExibicao(comunicacao.usercom, 'Comunicante')}</span>
        <span class="data">${formatarDataHora(comunicacao.dataCom)}</span>
      </div>
      <div class="campo">
        <span class="campo-label">Motivo:</span> ${comunicacao.motivo ?? '-'}
      </div>
      <div class="campo">
        <span class="campo-label">Natureza:</span> ${
          comunicacao.natureza ?? '-'
        }
        ${comunicacao.grauMotivo != null ? `(${comunicacao.grauMotivo})` : ''}
      </div>
      <div class="campo">
        <span class="campo-label">Infor do enquadramento:</span> ${
          comunicacao.enquadramento ?? '-'
        }
      </div>
      <div class="campo">
        <span class="campo-label">Descrição do fato:</span>
        <p class="campo-texto">${comunicacao.descricaoMotivo ?? '-'}</p>
      </div>
    </div>

    ${
      comunicacao.resposta
        ? `
    <div class="secao-titulo">II - Resposta</div>
    <div class="card">
      <div class="card-header">
        <span>👤 ${nomeExibicao(aluno, 'Aluno')}</span>
        <span class="data">${formatarDataHora(comunicacao.dataResp)}</span>
      </div>
      <div class="campo">
        <span class="campo-label">Resposta:</span>
        <p class="campo-texto italico">${comunicacao.resposta}</p>
      </div>
      ${
        blocoResponsaveis
          ? `<div class="responsaveis">${blocoResponsaveis}</div>`
          : ''
      }
    </div>`
        : ''
    }

    ${renderSecaoParecer({
      numero: 'III',
      titulo: 'Parecer do Comandante da Companhia',
      autor: comunicacao.usercmtcia,
      papel: 'CmtCia',
      data: comunicacao.dataParecerCmtCia,
      texto: comunicacao.parecerCmtCia,
    })}

    ${renderSecaoParecer({
      numero: 'IV',
      titulo: 'Parecer do Comandante do Corpo de Alunos',
      autor: comunicacao.userca,
      papel: 'CmtCA',
      data: comunicacao.dataParecerCa,
      texto: comunicacao.parecerCa,
    })}

    ${renderSecaoParecer({
      numero: 'V',
      titulo: 'Parecer do SubComando',
      autor: comunicacao.usersubcom,
      papel: 'Comando',
      data: comunicacao.dataParecerSubcom,
      texto: comunicacao.parecerSubcom,
    })}

    <div class="assinatura">
      <div class="nome-comandante">/* TODO: nome do Comandante do Colégio (config/BD) */</div>
      <div class="cargo-comandante">Comandante do Colégio da Polícia Militar - CPM</div>
      <img class="logo" src="${logo}" alt="Logo" />
    </div>

    ${blocoArquivamento}

    <div class="rodape-autenticidade">
      <img src="" alt="QR Code" />
      <span>A autenticidade desse documento pode ser conferida no site ${URL_VERIFICACAO_BASE}</span>
    </div>

    <div class="barra-status">
      Situação da Comunicação: ${comunicacao.status}
    </div>

  </body>
  </html>
  `;
}
