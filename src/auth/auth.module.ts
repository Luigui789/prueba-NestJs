import { Module } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { AuthController } from './auth.controller.js';
import { JwtModule } from '@nestjs/jwt'
import { PrismaModule } from '../prisma/prisma.module.js';


@Module({
  imports: [
    PrismaModule,
    JwtModule.register({
      secret: 'Secret-Key',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [AuthService],
  controllers: [AuthController]
})
export class AuthModule { }
