// ============================================
// lib/validators.ts
// Input validation helpers
// ============================================

export const validators = {
  email: (email: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  },

  password: (password: string): { valid: boolean; message?: string } => {
    if (password.length < 8) {
      return { valid: false, message: 'La contraseña debe tener al menos 8 caracteres' };
    }
    if (!/[A-Z]/.test(password)) {
      return { valid: false, message: 'Debe contener al menos una mayúscula' };
    }
    if (!/[a-z]/.test(password)) {
      return { valid: false, message: 'Debe contener al menos una minúscula' };
    }
    if (!/[0-9]/.test(password)) {
      return { valid: false, message: 'Debe contener al menos un número' };
    }
    return { valid: true };
  },

  phone: (phone: string): boolean => {
    const regex = /^\+?[\d\s\-()]+$/;
    return regex.test(phone) && phone.replace(/\D/g, '').length >= 9;
  },

  weight: (weight: number): boolean => {
    return weight >= 30 && weight <= 300;
  },

  height: (height: number): boolean => {
    return height >= 100 && height <= 250;
  },

  age: (age: number): boolean => {
    return age >= 13 && age <= 120;
  },

  bodyFat: (bodyFat: number): boolean => {
    return bodyFat >= 3 && bodyFat <= 60;
  }
};