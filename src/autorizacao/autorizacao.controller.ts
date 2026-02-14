import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AutorizacaoService } from './autorizacao.service';
import { CreateAutorizacaoDto } from './dtos/create-autorizacao.dto';
import { DespachoAutorizacaoDto } from './dtos/despacho-autorizacao.dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';

@Controller('autorizacao')
export class AutorizacaoController {
  constructor(private readonly autorizacaoService: AutorizacaoService) {}

  @Post('criar')
  create(
    @Body() dto: CreateAutorizacaoDto,
    @Query('userIdAut') userIdAut: string,
  ) {
    const finalDto = {
      ...dto,
      userIdAut: parseInt(userIdAut, 10),
    };

    return this.autorizacaoService.create(finalDto);
  }

  @Get('aluno-id/:alunoId')
  async findByAlunoTableId(@Param('alunoId') alunoId: number) {
    return this.autorizacaoService.findByAlunoTableId(Number(alunoId));
  }

  @UseGuards(JwtAuthGuard)
  @Get('dependentes')
  async findAutorizacoesDependentes(@Req() req) {
    const userId = req.user.id;
    return this.autorizacaoService.findByResponsavel(userId);
  }

  @Patch(':id/despacho')
  despachar(@Param('id') id: number, @Body() dto: DespachoAutorizacaoDto) {
    return this.autorizacaoService.despachar(Number(id), dto);
  }

  @Get()
  findAll() {
    return this.autorizacaoService.findAll();
  }

  @Get('aluno/:id')
  async findAutorizacoesByAluno(@Param('id') id: number) {
    return this.autorizacaoService.findByAlunoId(Number(id));
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.autorizacaoService.findById(Number(id));
  }

  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.autorizacaoService.delete(Number(id));
  }
}
