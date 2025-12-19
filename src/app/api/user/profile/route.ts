// ============================================
// 3. app/api/user/profile/route.ts
// ============================================

import { NextRequest, NextResponse } from 'next/server';
import NextAuth from 'next-auth';
import { auth } from '@/auth';
import prisma  from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        profile: true,
        goals: true
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    const profile = {
      name: user.name || '',
      email: user.email,
      avatar: user.image || null,
      phone: user.profile?.phone || '',
      age: user.profile?.age || 0,
      gender: user.profile?.gender || 'male',
      height: user.profile?.heightCm || 0,
      weight: user.profile?.currentWeight || 0,
      bodyFat: user.profile?.bodyFatPercentage || 0,
      activityLevel: user.profile?.activityLevel || 'moderate'
    };

    return NextResponse.json({ profile });

  } catch (error) {
    console.error('Get profile error:', error);
    return NextResponse.json(
      { error: 'Error al obtener perfil' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { section, data } = body;

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { profile: true }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    if (section === 'personal') {
      await prisma.user.update({
        where: { id: user.id },
        data: { name: data.name }
      });

      await prisma.userProfile.upsert({
        where: { userId: user.id },
        create: {
          userId: user.id,
          age: data.age || 0,
          gender: data.gender || 'male',
          heightCm: data.height || 0,
          currentWeight: data.weight || 0,
          bodyFatPercentage: data.bodyFat || 0,
          activityLevel: data.activityLevel || 'moderate',
          workoutDaysPerWeek: 0,
          phone: data.phone || ''
        },
        update: {
          phone: data.phone || '',
          gender: data.gender
        }
      });
    }

    if (section === 'biometrics') {
      await prisma.userProfile.upsert({
        where: { userId: user.id },
        create: {
          userId: user.id,
          age: data.age,
          gender: data.gender || 'male',
          heightCm: data.height,
          currentWeight: data.weight,
          bodyFatPercentage: data.bodyFat || null,
          activityLevel: data.activityLevel,
          workoutDaysPerWeek: 0
        },
        update: {
          age: data.age,
          heightCm: data.height,
          currentWeight: data.weight,
          bodyFatPercentage: data.bodyFat || null,
          activityLevel: data.activityLevel
        }
      });

      await prisma.weightEntry.create({
        data: {
          userId: user.id,
          date: new Date(),
          weight: data.weight,
          bodyFat: data.bodyFat || null
        }
      });
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Update profile error:', error);
    return NextResponse.json(
      { error: 'Error al actualizar perfil' },
      { status: 500 }
    );
  }
}
