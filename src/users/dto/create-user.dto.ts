import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
    @ApiProperty({ required: true, example: 'usuario@empresa.com' })
    mail: string;

    @ApiProperty({ required: false, example: 'John Doe' })
    name?: string;

    @ApiProperty({ required: false, example: '+1234567890' })
    telephone?: string;

    @ApiProperty({ required: true, example: 'password213' })
    password: string;

    @ApiProperty({ required: true, example: 1, description: 'ID del Tenant' })
    tenantId: number;
}

