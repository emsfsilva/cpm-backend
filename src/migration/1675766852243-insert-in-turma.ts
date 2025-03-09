import { MigrationInterface, QueryRunner } from 'typeorm';

export class insertInTurma1675766852243 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
            INSERT INTO turma("id", "name", "cia_id") VALUES (1, 'Sem Turma', 1);

            INSERT INTO turma("id", "name", "cia_id") VALUES (2, 'Turma A1', 2);
            INSERT INTO turma("id", "name", "cia_id") VALUES (3, 'Turma A2', 2);
            INSERT INTO turma("id", "name", "cia_id") VALUES (4, 'Turma A3', 2);
            INSERT INTO turma("id", "name", "cia_id") VALUES (5, 'Turma A4', 2);
            INSERT INTO turma("id", "name", "cia_id") VALUES (6, 'Turma A5', 2);
            INSERT INTO turma("id", "name", "cia_id") VALUES (7, 'Turma A6', 2);
            INSERT INTO turma("id", "name", "cia_id") VALUES (8, 'Turma A7', 2);
            INSERT INTO turma("id", "name", "cia_id") VALUES (9, 'Turma A8', 2);
            INSERT INTO turma("id", "name", "cia_id") VALUES (10, 'Turma A9', 2);
            INSERT INTO turma("id", "name", "cia_id") VALUES (11, 'Turma A10', 2);

            INSERT INTO turma("id", "name", "cia_id") VALUES (12, 'Turma B1', 2);
            INSERT INTO turma("id", "name", "cia_id") VALUES (13, 'Turma B2', 2);
            INSERT INTO turma("id", "name", "cia_id") VALUES (14, 'Turma B3', 2);
            INSERT INTO turma("id", "name", "cia_id") VALUES (15, 'Turma B4', 2);
            INSERT INTO turma("id", "name", "cia_id") VALUES (16, 'Turma B5', 2);
            INSERT INTO turma("id", "name", "cia_id") VALUES (17, 'Turma B6', 2);
            INSERT INTO turma("id", "name", "cia_id") VALUES (18, 'Turma B7', 2);
            INSERT INTO turma("id", "name", "cia_id") VALUES (19, 'Turma B8', 2);
            INSERT INTO turma("id", "name", "cia_id") VALUES (20, 'Turma B9', 2);
            INSERT INTO turma("id", "name", "cia_id") VALUES (21, 'Turma B10', 2);

            INSERT INTO turma("id", "name", "cia_id") VALUES (22, 'Turma C1', 3);
            INSERT INTO turma("id", "name", "cia_id") VALUES (23, 'Turma C2', 3);
            INSERT INTO turma("id", "name", "cia_id") VALUES (24, 'Turma C3', 3);
            INSERT INTO turma("id", "name", "cia_id") VALUES (25, 'Turma C4', 3);
            INSERT INTO turma("id", "name", "cia_id") VALUES (26, 'Turma C5', 3);
            INSERT INTO turma("id", "name", "cia_id") VALUES (27, 'Turma C6', 3);
            INSERT INTO turma("id", "name", "cia_id") VALUES (28, 'Turma C7', 3);
            INSERT INTO turma("id", "name", "cia_id") VALUES (29, 'Turma C8', 3);
            INSERT INTO turma("id", "name", "cia_id") VALUES (30, 'Turma C9', 3);
            INSERT INTO turma("id", "name", "cia_id") VALUES (31, 'Turma C10', 3);

            INSERT INTO turma("id", "name", "cia_id") VALUES (32, 'Turma D1', 3);
            INSERT INTO turma("id", "name", "cia_id") VALUES (33, 'Turma D2', 3);
            INSERT INTO turma("id", "name", "cia_id") VALUES (34, 'Turma D3', 3);
            INSERT INTO turma("id", "name", "cia_id") VALUES (35, 'Turma D4', 3);
            INSERT INTO turma("id", "name", "cia_id") VALUES (36, 'Turma D5', 3);
            INSERT INTO turma("id", "name", "cia_id") VALUES (37, 'Turma D6', 3);
            INSERT INTO turma("id", "name", "cia_id") VALUES (38, 'Turma D7', 3);
            INSERT INTO turma("id", "name", "cia_id") VALUES (39, 'Turma D8', 3);
            INSERT INTO turma("id", "name", "cia_id") VALUES (40, 'Turma D9', 3);
            INSERT INTO turma("id", "name", "cia_id") VALUES (41, 'Turma D10', 3);

            
            
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
            DELETE FROM public.turma;
        `);
  }
}
