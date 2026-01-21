import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTableAutorizacao1675766857445 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE public.autorizacao (
        id SERIAL PRIMARY KEY,
        user_id_aut integer NOT NULL,
        user_id_al_aut integer NOT NULL,
        motivo_aut varchar NOT NULL,
        datainicio varchar NOT NULL,
        datafinal varchar NOT NULL,
        horainicio varchar(5) NOT NULL,
        horafinal varchar(5) NOT NULL,
        seg varchar(3) NULL,
        ter varchar(3) NULL,
        qua varchar(3) NULL,
        qui varchar(3) NULL,
        sex varchar(3) NULL,
        sab varchar(3) NULL,
        dom varchar(3) NULL,
        despacho varchar NULL,
        datadespacho timestamp DEFAULT now() NULL,
        status_aut varchar NOT NULL,
        obs_aut varchar NOT NULL,
        user_id_despa_aut integer NULL,
        situacao_atual varchar NOT NULL,
        created_at timestamp DEFAULT now() NOT NULL,
        updated_at timestamp DEFAULT now() NOT NULL
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP TABLE public.autorizacao;
    `);
  }
}
