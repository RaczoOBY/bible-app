import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email e senha são obrigatórios' },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email já cadastrado' },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        xp: 0,
        nivel: 1,
        sequenciaAtual: 0,
        maiorSequencia: 0,
      },
    });

    return NextResponse.json(
      { message: 'Conta criada com sucesso', userId: user.id },
      { status: 201 }
    );
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    return NextResponse.json(
      { error: 'Erro ao criar conta' },
      { status: 500 }
    );
  }
}
