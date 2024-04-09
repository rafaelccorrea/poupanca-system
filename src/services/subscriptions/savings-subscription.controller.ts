import { Controller, Post, Body, Param, UseGuards, Req } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { SavingsSubscriptionService } from './savings-subscription.service';
import { SavingsSubscriptionDto } from './dto/savings-subscription.dto';
import { SavingsService } from '../savings/savings.service';
import { Savings } from '~/database/entities/savings.entity';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { Request } from 'express';

@ApiTags('Inscrição na poupança')
@ApiBearerAuth()
@Controller('savings-subscriptions')
export class SavingsSubscriptionController {
  constructor(
    private readonly subscriptionService: SavingsSubscriptionService,
    private readonly savingsService: SavingsService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post(':savingsId')
  @ApiParam({ name: 'savingsId', description: 'ID da poupança', example: '1' })
  @ApiOperation({ summary: 'Inscrever-se em uma poupança' })
  @ApiBody({ type: SavingsSubscriptionDto })
  @ApiResponse({
    status: 201,
    description: 'Usuário inscrito na poupança com sucesso',
  })
  async subscribeToSavings(
    @Param('savingsId') savingsId: number,
    @Body() dto: SavingsSubscriptionDto,
    @Req() req: Request,
  ): Promise<void> {
    const ownerId = req.user.id;
    const saving: Savings = await this.savingsService.findById(
      savingsId,
      ownerId,
    );
    await this.subscriptionService.subscribeToSavings(dto.userId, saving);
  }
}
