import { Injectable, Logger } from '@nestjs/common';
import type { Browser } from 'puppeteer';

@Injectable()
export class PdfGeneratorService {
  private readonly logger = new Logger(PdfGeneratorService.name);

  async gerarPdfDeHtml(html: string): Promise<Buffer> {
    const importDynamic = new Function(
      'modulePath',
      'return import(modulePath)',
    );
    const importedModule = (await importDynamic(
      'puppeteer',
    )) as typeof import('puppeteer');
    const { default: puppeteer } = importedModule;

    const browser: Browser = await puppeteer.launch({
      headless: true,

      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    try {
      const page = await browser.newPage();

      await page.setContent(html, { waitUntil: 'load' });

      const pdfUint8Array = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: {
          top: '18mm',
          bottom: '18mm',
          left: '14mm',
          right: '14mm',
        },
      });

      return Buffer.from(pdfUint8Array);
    } catch (error) {
      this.logger.error('Erro ao gerar PDF a partir de HTML', error);
      throw error;
    } finally {
      await browser.close();
    }
  }
}
