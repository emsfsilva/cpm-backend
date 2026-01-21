import { MigrationInterface, QueryRunner } from 'typeorm';

export class createTableComunicacao1675766857444 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE public.comunicacao ( 
        id SERIAL PRIMARY KEY, 

        -- DADOS DO COMUNICANTE
        user_id_com integer NOT NULL,
        motivo character varying NOT NULL,
        grau_motivo double precision,
        descricao_motivo character varying NOT NULL,
        datainicio DATE NOT NULL,
        horainicio TIME NOT NULL,
        natureza character varying,
        enquadramento character varying,
        data_com timestamp without time zone DEFAULT now(),

        -- DADOS DO ARQUIVAMENTO
        user_id_arquivamento integer,
        motivo_arquivamento character varying,

        -- DADOS DO ALUNO
        user_id_al integer NOT NULL, 
        resposta character varying,
        data_resp timestamp without time zone DEFAULT now(),

        -- PARECER DO CMT DA CIA
        user_id_cmtcia integer, 
        parecer_cmt_cia character varying, 
        data_parecer_cmt_cia timestamp without time zone DEFAULT now(),
        
        -- PARECER DO CMT DO CA
        user_id_ca integer, 
        parecer_ca character varying, 
        data_parecer_ca timestamp without time zone DEFAULT now(),

        -- PARECER DO SUBCOM
        user_id_subcom integer, 
        parecer_subcom character varying, 
        data_parecer_subcom timestamp without time zone DEFAULT now(),

        -- CAMPOS DE CIÊNCIA DOS RESPONSÁVEIS
        data_ciencia_responsavel1 timestamp without time zone,
        data_ciencia_responsavel2 timestamp without time zone,

        -- RELACIONAMENTO COM OS RESPONSÁVEIS
        user_responsalvel1 integer,
        user_responsalvel2 integer,

        -- STATUS
        status character varying NOT NULL,
        dtatualizacaostatus timestamp without time zone DEFAULT now() NOT NULL, 
        created_at timestamp without time zone DEFAULT now() NOT NULL, 
        updated_at timestamp without time zone DEFAULT now() NOT NULL,

        -- FOREIGN KEYS
        CONSTRAINT fk_user_com FOREIGN KEY (user_id_com) REFERENCES public.user(id), 
        CONSTRAINT fk_user_al FOREIGN KEY (user_id_al) REFERENCES public.user(id),
        CONSTRAINT fk_user_cmtcia FOREIGN KEY (user_id_cmtcia) REFERENCES public.user(id),
        CONSTRAINT fk_user_ca FOREIGN KEY (user_id_ca) REFERENCES public.user(id),
        CONSTRAINT fk_user_subcom FOREIGN KEY (user_id_subcom) REFERENCES public.user(id),
        CONSTRAINT fk_user_id_arquivamento FOREIGN KEY (user_id_arquivamento) REFERENCES public.user(id),
        CONSTRAINT fk_user_responsalvel1 FOREIGN KEY (user_responsalvel1) REFERENCES public.user(id),
        CONSTRAINT fk_user_responsalvel2 FOREIGN KEY (user_responsalvel2) REFERENCES public.user(id)
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP TABLE public.comunicacao;
    `);
  }
}
