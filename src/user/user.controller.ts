import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserId } from 'src/decorators/user-id.decorator';
import { CreateUserDto } from './dtos/createUser.dto';
import { ReturnUserDto } from './dtos/returnUser.dto';
import { UpdatePasswordDTO } from './dtos/update-password.dto';
import { UserService } from './user.service';
import { Roles } from 'src/decorators/roles.decorator';
import { UserType } from './enum/user-type.enum';
import { ReturnAlunoDTO } from 'src/aluno/dtos/return-aluno.dto';

@Controller('user')
/*@Roles(
  UserType.Master,
  UserType.Comando,
  UserType.CmtCa,
  UserType.CmtCia,
  UserType.Adm,
  UserType.Monitor,
  UserType.Aluno,
)
@UsePipes(ValidationPipe)
*/
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  // Agora retornamos um ReturnUserDto em vez de UserEntity
  async createUser(@Body() createUser: CreateUserDto): Promise<ReturnUserDto> {
    const user = await this.userService.createUser(createUser);
    return new ReturnUserDto(user); // Retorna o DTO adequado
  }

  @Get()
  async getAllUser(): Promise<ReturnUserDto[]> {
    const users = await this.userService.getAllUser();
    return users.map((userEntity) => new ReturnUserDto(userEntity)); // Transforma todos em ReturnUserDto
  }

  @Get('/:userId')
  async getUserById(@Param('userId') userId: number): Promise<ReturnUserDto> {
    const user = await this.userService.getUserByIdUsingRelations(userId);

    let alunoDTO;
    if (user?.typeUser === 1 && user.aluno) {
      const grauAtual = (user.aluno as any).grauAtual;
      alunoDTO = new ReturnAlunoDTO(user.aluno, grauAtual);
    }

    return new ReturnUserDto({
      ...user,
      aluno: alunoDTO,
    });
  }

  @Patch()
  async updatePasswordUser(
    @Body() updatePasswordDTO: UpdatePasswordDTO,
    @UserId() userId: number,
  ) {
    return this.userService.updatePasswordUser(updatePasswordDTO, userId);
  }
}
