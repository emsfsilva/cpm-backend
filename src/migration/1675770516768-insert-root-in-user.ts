import { MigrationInterface, QueryRunner } from 'typeorm';

export class insertRootInUser1675770516768 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
            INSERT INTO public."user"(
                name, seduc, cpf, orgao, pg, mat, ng, funcao, type_user, phone, password)
                VALUES ('EMERSON FRANCISCO DA SILVA', 'emerson.francisco1', '082.866.674-17','PMPE', 'CB', 1157590, 'FRANCISCO', 'Master', 10, '(81)98685-4814', '$2b$10$BhaMKrzUdPJFaHLcdvls7.lFMHojH9/sG/jwrp.Is0YXIlpBe4gI.');
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
            DELETE FROM public."user"
                WHERE seduc like 'emerson.francisco1';
        `);
  }
}
