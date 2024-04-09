import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Put,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { Transaction } from '~/database/entities/transaction.entity';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';

@ApiTags('Transações')
@ApiBearerAuth()
@Controller('transactions')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Listar todas as transações de uma poupança' })
  @ApiParam({ name: 'savingsId', description: 'ID da poupança' })
  @ApiResponse({ status: 200, type: [Transaction] })
  @Get('savings/:savingsId')
  async getAllTransactionsBySavingsId(
    @Param('savingsId') savingsId: number,
    @Request() req,
  ): Promise<Transaction[]> {
    const userId = req.user.id;
    return this.transactionService.getAllTransactionsBySavingsId(
      userId,
      savingsId,
    );
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Aprovar solicitação de saque' })
  @ApiParam({ name: 'id', description: 'ID da transação de saque' })
  @Put(':id/approve-withdrawal')
  async approveWithdrawal(
    @Param('id') id: number,
    @Request() req,
  ): Promise<void> {
    const userId = req.user.id;
    return this.transactionService.approveWithdrawal(id, userId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Realizar um depósito em uma poupança' })
  @ApiBody({ type: CreateTransactionDto })
  @ApiResponse({ status: 201, type: Transaction })
  @Post('deposit')
  async depositToSavings(
    @Body() createTransactionDto: CreateTransactionDto,
    @Request() req,
  ): Promise<void> {
    const { amount, savingsId } = createTransactionDto;
    const userId = req.user.id;
    return this.transactionService.depositToSavings(amount, userId, savingsId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Solicitar um saque de uma poupança' })
  @ApiBody({ type: CreateTransactionDto })
  @ApiResponse({ status: 201, type: Transaction })
  @Post('withdraw')
  async withdrawFromSavings(
    @Body() createTransactionDto: CreateTransactionDto,
    @Request() req,
  ): Promise<void> {
    const userId = req.user.id;
    const { amount, savingsId } = createTransactionDto;
    return this.transactionService.withdrawFromSavings(
      amount,
      userId,
      savingsId,
    );
  }
}
