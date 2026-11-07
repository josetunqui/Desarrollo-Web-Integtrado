import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

// 1) DNI peruano: exactamente 8 dígitos
export function dniValidator(control: AbstractControl): ValidationErrors | null {
  const valor = control.value as string;
  if (!valor) return null; // los vacíos los valida Validators.required
  return /^\d{8}$/.test(valor) ? null : { dniInvalido: true };
}

// 2) Celular peruano: 9 dígitos y empieza con 9
export function celularPeruValidator(control: AbstractControl): ValidationErrors | null {
  const valor = control.value as string;
  if (!valor) return null;
  return /^9\d{8}$/.test(valor) ? null : { celularInvalido: true };
}

// 3) RUC: 11 dígitos y empieza con 10 o 20
export function rucValidator(control: AbstractControl): ValidationErrors | null {
  const valor = control.value as string;
  if (!valor) return null;
  return /^(10|20)\d{9}$/.test(valor) ? null : { rucInvalido: true };
}

// 4) Validador cruzado (a nivel de grupo): dos campos deben ser iguales
export function camposIgualesValidator(campo: string, confirmacion: string): ValidatorFn {
  return (grupo: AbstractControl): ValidationErrors | null => {
    const valor1 = grupo.get(campo)?.value;
    const valor2 = grupo.get(confirmacion)?.value;
    if (!valor2) return null;
    return valor1 === valor2 ? null : { passwordsNoCoinciden: true };
  };
}
