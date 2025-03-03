import { ReturnAddressDto } from '../../address/dtos/returnAddress.dto';
import { UserEntity } from '../entities/user.entity';

//Essa classe exporta o objeto para o controleer da forma que deixamos aqui.
//Ou seja, quando o usuario clica em listar Usuarios,entãp são esses dados que aparecem
export class ReturnUserDto {
  id: number;
  name: string;
  email: string;
  phone: string;
  cpf: string;
  addresses?: ReturnAddressDto[];

  constructor(userEntity: UserEntity) {
    this.id = userEntity.id;
    this.name = userEntity.name;
    this.email = userEntity.email;
    this.phone = userEntity.phone;
    this.cpf = userEntity.cpf;

    this.addresses = userEntity.addresses
      ? userEntity.addresses.map((address) => new ReturnAddressDto(address))
      : undefined;
  }
}
