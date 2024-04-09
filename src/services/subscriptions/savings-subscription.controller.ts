import { Controller, Post, Param, UseGuards, Req } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { SavingsSubscriptionService } from './savings-subscription.service';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { Request } from 'express';

@ApiTags('Inscrição na poupança')
@ApiBearerAuth()
@Controller('savings-subscriptions')
export class SavingsSubscriptionController {
  constructor(
    private readonly subscriptionService: SavingsSubscriptionService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post(':savingsId')
  @ApiParam({ name: 'savingsId', description: 'ID da poupança', example: '1' })
  @ApiOperation({ summary: 'Inscrever-se em uma poupança' })
  @ApiResponse({
    status: 201,
    description: 'Usuário inscrito na poupança com sucesso',
  })
  async subscribeToSavings(
    @Param('savingsId') savingsId: number,
    @Req() req: Request,
  ): Promise<void> {
    const ownerId = req.user.id;
    await this.subscriptionService.subscribeToSavings(ownerId, savingsId);
  }
}
