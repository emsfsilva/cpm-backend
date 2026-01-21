import { MigrationInterface, QueryRunner } from 'typeorm';

export class createTableComentario1675766857446 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE public.comentario (
        id integer NOT NULL,
        user_id_comentario integer NOT NULL,
        comentario text NOT NULL,
        created_at timestamp without time zone DEFAULT now(),
        updated_at timestamp without time zone DEFAULT now(),
        CONSTRAINT comentario_pk PRIMARY KEY (id),
        CONSTRAINT comentario_user_fk FOREIGN KEY (user_id_comentario)
          REFERENCES public."user"(id) ON DELETE CASCADE
      );

      CREATE SEQUENCE public.comentario_id_seq
        AS integer
        START WITH 1
        INCREMENT BY 1
        NO MINVALUE
        NO MAXVALUE
        CACHE 1;

      ALTER SEQUENCE public.comentario_id_seq OWNED BY public.comentario.id;

      ALTER TABLE ONLY public.comentario 
        ALTER COLUMN id SET DEFAULT nextval('public.comentario_id_seq'::regclass);

      -- 🔹 Garante que só exista um registro
      CREATE UNIQUE INDEX comentario_unico_idx ON public.comentario((1));
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP INDEX IF EXISTS comentario_unico_idx;
      DROP TABLE IF EXISTS public.comentario;
      DROP SEQUENCE IF EXISTS public.comentario_id_seq;
    `);
  }
}
