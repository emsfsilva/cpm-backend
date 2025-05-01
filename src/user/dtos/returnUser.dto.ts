import { ReturnAlunoDTO } from 'src/aluno/dtos/return-aluno.dto';
import { ReturnAddressDto } from '../../address/dtos/returnAddress.dto';
import { UserType } from '../enum/user-type.enum'; // Importe o UserType
import { ReturnAdmDTO } from 'src/adm/dtos/return-adm.dto';
import { ReturnCaDTO } from 'src/ca/dtos/return-ca.dto';

// Essa classe exporta o objeto para o controller da forma que deixamos aqui.
// Ou seja, quando o usuário clica em listar usuários, então são esses dados que aparecem
export class ReturnUserDto {
  id: number;
  name: string;
  email: string;
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
  adm?: ReturnAdmDTO;
  ca?: ReturnCaDTO;

  constructor(userEntity: any, grauAtual?: number) {
    // Mudamos para 'any' porque o resultado pode ter o totalComportamento
    this.id = userEntity.id;
    this.name = userEntity.name;
    this.email = userEntity.email;
    this.phone = userEntity.phone;
    this.cpf = userEntity.cpf;
    this.orgao = userEntity.orgao;
    this.pg = userEntity.pg;
    this.mat = userEntity.mat;
    this.nomeGuerra = userEntity.nomeGuerra;
    this.funcao = userEntity.funcao;
    this.typeUser = userEntity.typeUser;

    // Mapeando as relações
    this.addresses = userEntity.addresses
      ? userEntity.addresses.map((address) => new ReturnAddressDto(address))
      : undefined;

    // Mapeamento do administrador
    this.aluno = userEntity.aluno
      ? new ReturnAlunoDTO(userEntity.aluno, grauAtual)
      : undefined;

    // Mapeamento do administrador
    this.adm = userEntity.adm ? new ReturnAdmDTO(userEntity.adm) : undefined;

    // Mapeamento do Ca
    this.ca = userEntity.ca ? new ReturnCaDTO(userEntity.ca) : undefined;
  }
}
