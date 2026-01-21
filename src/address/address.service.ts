import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CityService } from '../city/city.service';
import { UserService } from '../user/user.service';
import { Repository } from 'typeorm';
import { CreateAddressDto } from './dtos/createAddress.dto';
import { AddressEntity } from './entities/address.entity';

@Injectable()
export class AddressService {
  constructor(
    @InjectRepository(AddressEntity)
    private readonly addressRepository: Repository<AddressEntity>,
    private readonly userService: UserService,
    private readonly cityService: CityService,
  ) {}

  //Aqui esta acessando as info basicas do endereço que estao no DTO
  // src/address/address.service.ts

  async createAddress(
    createAddressDto: CreateAddressDto,
    userLogadoId: number,
  ): Promise<AddressEntity> {
    await this.userService.findUserById(createAddressDto.userId);
    await this.cityService.findCityById(createAddressDto.cityId);

    return this.addressRepository.save({
      ...createAddressDto,
      userId: createAddressDto.userId, // Explicitamente
    });
  }

  async findAddressByUserId(userId: number): Promise<AddressEntity[]> {
    const addresses = await this.addressRepository.find({
      where: {
        userId,
      },
      relations: {
        city: {
          state: true,
        },
      },
    });

    if (!addresses || addresses.length === 0) {
      throw new NotFoundException(`Address not found for userId: ${userId}`);
    }

    return addresses;
  }
}
