import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './services/auth/auth.controller';
import { AuthService } from './services/auth/auth.service';
import { UserController } from './services/user/user.controller';
import { UserService } from './services/user/user.service';
import { DatabaseModule } from './database/database.module';
import { User } from './database/entities/user.entity';

@Module({
  imports: [
    DatabaseModule,
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AuthController, UserController],
  providers: [AuthService, UserService],
})
export class AppModule {}
