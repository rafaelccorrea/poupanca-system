import { Request } from 'express';
import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiBody,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { SavingsService } from './savings.service';
import { CreateSavingsDto } from './dto/create-savings.dto';
import { Savings } from '~/database/entities/savings.entity';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';

@ApiTags('Poupança')
@ApiBearerAuth()
@Controller('savings')
export class SavingsController {
  constructor(private readonly savingsService: SavingsService) {}

  @ApiOperation({ summary: 'Criar uma nova poupança' })
  @ApiBody({ type: CreateSavingsDto })
  @ApiResponse({ status: 201, type: Savings })
  @UseGuards(JwtAuthGuard)
  @Post()
  async createSavings(
    @Body() createSavingsDto: CreateSavingsDto,
    @Req() req: Request,
  ): Promise<void> {
    const { name } = createSavingsDto;
    const ownerId = req.user.id;
    return await this.savingsService.createSavings(name, ownerId);
  }

  @ApiOperation({ summary: 'Obter saldo da poupança por ID' })
  @ApiParam({ name: 'id', description: 'ID da poupança' })
  @ApiResponse({ status: 200, type: Number })
  @UseGuards(JwtAuthGuard)
  @Get(':id/balance')
  async getBalance(
    @Req() req: Request,
    @Param('id') id: number,
  ): Promise<number> {
    const ownerId = req.user.id;
    return await this.savingsService.getBalance(id, ownerId);
  }
}
