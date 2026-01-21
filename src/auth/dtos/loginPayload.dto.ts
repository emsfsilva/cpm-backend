import { UserEntity } from '../../user/entities/user.entity';

//Esses são os dados do TOKEN
export class LoginPayload {
  id: number;
  imagemUrl: string;
  name: string;
  seduc: string;
  phone: string;
  cpf: string;
  orgao: string;
  pg: string;
  mat: number;
  nomeGuerra: string;
  funcao: string;
  typeUser: number;

  constructor(user: UserEntity) {
    this.id = user.id;
    this.imagemUrl = user.imagemUrl;
    this.name = user.name;
    this.seduc = user.seduc;
    this.phone = user.phone;
    this.cpf = user.cpf;
    this.orgao = user.orgao;
    this.pg = user.pg;
    this.mat = user.mat;
    this.nomeGuerra = user.nomeGuerra;
    this.funcao = user.funcao;
    this.typeUser = user.typeUser;
  }
}
