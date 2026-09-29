import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';
import * as bcrypt from 'bcryptjs'

@Injectable()
export class AuthService {
    constructor(
        private JwtService: JwtService,
        private prisma: PrismaService
    ) { }
    async validateUser(user: LoginDto) {
        const foundUser = await this.prisma.user.findUnique({
            where: {
                mail: user.email
            }
        });
        if (!foundUser) return null;

        const isPasswordValid = await bcrypt.compare(user.password, foundUser.password)

        if (isPasswordValid) {
            return this.JwtService.sign({

                id: foundUser.id,
                email: foundUser.mail,
                role: foundUser.role,
            });
        } else {
            throw new UnauthorizedException('Credenciales invalidas');
        }
    }

}
