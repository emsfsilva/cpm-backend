import { ReturnAlunoDTO } from 'src/aluno/dtos/return-aluno.dto';
import { ReturnAddressDto } from '../../address/dtos/returnAddress.dto';
import { UserType } from '../enum/user-type.enum';

export class ReturnUserDto {
  id: number;
  imagemUrl?: string;
  imagemPerfil?: string;
  name: string;
  seduc: string;
  phone: string;
  cpf: string;
  orgao: string;
  pg: string;
  mat: number;
  nomeGuerra: string;
  funcao: string;
  typeUser: UserType;
  addresses?: ReturnAddressDto[];
  aluno?: ReturnAlunoDTO;

  constructor(userEntity: any, grauAtual?: number) {
    this.id = userEntity.id;
    this.imagemUrl = userEntity.imagemUrl;
    this.imagemPerfil = userEntity.imagemPerfil;
    this.name = userEntity.name;
    this.seduc = userEntity.seduc;
    this.phone = userEntity.phone;
    this.cpf = userEntity.cpf;
    this.orgao = userEntity.orgao;
    this.pg = userEntity.pg;
    this.mat = userEntity.mat;
    this.nomeGuerra = userEntity.nomeGuerra;
    this.funcao = userEntity.funcao;
    this.typeUser = userEntity.typeUser;

    this.addresses = userEntity.addresses
      ? userEntity.addresses.map((address) => new ReturnAddressDto(address))
      : undefined;

    this.aluno = userEntity.aluno
      ? new ReturnAlunoDTO(userEntity.aluno, grauAtual)
      : undefined;
  }
}
