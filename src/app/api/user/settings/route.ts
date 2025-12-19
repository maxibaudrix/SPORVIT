// ============================================
// 5. app/api/user/settings/route.ts
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
        goals: true,
        profile: true
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    let userSettings = await prisma.userSettings.findUnique({
      where: { userId: user.id }
    });

    if (!userSettings) {
      userSettings = await prisma.userSettings.create({
        data: {
          userId: user.id,
          notificationsEmail: true,
          notificationsPush: true,
          notificationsWorkoutReminders: true,
          notificationsMealReminders: true,
          notificationsWeeklyReport: true,
          unitsWeight: 'kg',
          unitsHeight: 'cm',
          unitsDistance: 'km',
          theme: 'dark',
          language: 'es'
        }
      });
    }

    const settings = {
      goalType: user.goals?.goalType || 'cut',
      targetWeight: user.goals?.targetWeight || 70,
      targetDate: user.goals?.targetDate?.toISOString().split('T')[0] || '',
      weeklyWeightChange: -0.5,

      notifications: {
        email: userSettings.notificationsEmail,
        push: userSettings.notificationsPush,
        workoutReminders: userSettings.notificationsWorkoutReminders,
        mealReminders: userSettings.notificationsMealReminders,
        weeklyReport: userSettings.notificationsWeeklyReport
      },
      units: {
        weight: userSettings.unitsWeight,
        height: userSettings.unitsHeight,
        distance: userSettings.unitsDistance
      },
      theme: userSettings.theme,
      language: userSettings.language
    };

    return NextResponse.json({ settings });

  } catch (error) {
    console.error('Get settings error:', error);
    return NextResponse.json(
      { error: 'Error al obtener configuración' },
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
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    if (section === 'goals') {
      await prisma.userGoals.upsert({
        where: { userId: user.id },
        create: {
          userId: user.id,
          goalType: data.goalType,
          targetWeight: data.targetWeight,
          targetDate: data.targetDate ? new Date(data.targetDate) : null,
          targetCalories: 2000,
          targetProteinG: 150,
          targetCarbsG: 200,
          targetFatG: 60,
          bmr: 1800,
          tdee: 2400
        },
        update: {
          goalType: data.goalType,
          targetWeight: data.targetWeight,
          targetDate: data.targetDate ? new Date(data.targetDate) : null
        }
      });
    }

    if (section === 'preferences') {
      await prisma.userSettings.upsert({
        where: { userId: user.id },
        create: {
          userId: user.id,
          notificationsEmail: data.notifications.email,
          notificationsPush: data.notifications.push,
          notificationsWorkoutReminders: data.notifications.workoutReminders,
          notificationsMealReminders: data.notifications.mealReminders,
          notificationsWeeklyReport: data.notifications.weeklyReport,
          unitsWeight: data.units.weight,
          unitsHeight: data.units.height,
          unitsDistance: data.units.distance,
          theme: data.theme,
          language: data.language
        },
        update: {
          notificationsEmail: data.notifications.email,
          notificationsPush: data.notifications.push,
          notificationsWorkoutReminders: data.notifications.workoutReminders,
          notificationsMealReminders: data.notifications.mealReminders,
          notificationsWeeklyReport: data.notifications.weeklyReport,
          unitsWeight: data.units.weight,
          unitsHeight: data.units.height,
          unitsDistance: data.units.distance,
          theme: data.theme,
          language: data.language
        }
      });
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Update settings error:', error);
    return NextResponse.json(
      { error: 'Error al actualizar configuración' },
      { status: 500 }
    );
  }
}