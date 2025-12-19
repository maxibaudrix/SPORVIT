// ============================================
// lib/api-response.ts
// Standardized API responses
// ============================================

import { NextResponse } from 'next/server';

export class ApiResponse {
  static success(data: any, status: number = 200) {
    return NextResponse.json(
      { success: true, data },
      { status }
    );
  }

  static error(message: string, status: number = 400, details?: any) {
    return NextResponse.json(
      { 
        success: false, 
        error: message,
        details 
      },
      { status }
    );
  }

  static unauthorized(message: string = 'No autorizado') {
    return this.error(message, 401);
  }

  static notFound(message: string = 'Recurso no encontrado') {
    return this.error(message, 404);
  }

  static serverError(message: string = 'Error interno del servidor') {
    return this.error(message, 500);
  }
}