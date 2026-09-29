import { PrismaClient, Role } from '../generated/prisma/index.js';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Iniciando seed...');

    // 1. Obtener o actualizar Tenant inicial
    let tenant = await prisma.tenant.findFirst();
    if (!tenant) {
        tenant = await prisma.tenant.create({
            data: {
                name: 'Tenant Principal',
            },
        });
    } else {
        tenant = await prisma.tenant.update({
            where: { id: tenant.id },
            data: { name: 'Tenant Principal' },
        });
    }
    console.log(`✅ Tenant listo: "${tenant.name}" con ID: ${tenant.id}`);

    // 2. Hashear contraseña
    const hashedPassword = await bcrypt.hash('Admin123!', 10);

    // 3. Crear usuario ADMIN inicial
    const admin = await prisma.user.upsert({
        where: { mail: 'admin@example.com' },
        update: {},
        create: {
            mail: 'admin@example.com',
            name: 'Admin Principal',
            password: hashedPassword,
            telephone: '+1234567890',
            role: Role.ADMIN,
            tenantId: tenant.id,
        },
    });
    console.log(`✅ Usuario creado: ${admin.mail} (Rol: ${admin.role})`);

    // 4. Crear usuario regular de prueba
    const userPassword = await bcrypt.hash('User123!', 10);
    const regularUser = await prisma.user.upsert({
        where: { mail: 'usuario@example.com' },
        update: {},
        create: {
            mail: 'usuario@example.com',
            name: 'Usuario Regular',
            password: userPassword,
            telephone: '+9876543210',
            role: Role.USER,
            tenantId: tenant.id,
        },
    });
    console.log(`✅ Usuario creado: ${regularUser.mail} (Rol: ${regularUser.role})`);

    console.log('✨ Seed finalizado exitosamente.');
}

main()
    .catch((e) => {
        console.error('❌ Error ejecutando seed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

