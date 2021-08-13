import { FormGroup, ValidatorFn ,ValidationErrors, AbstractControl } from '@angular/forms';

export const PasswordsMatchValidator : ValidatorFn = (control: FormGroup): ValidationErrors | null => {
    const password = control.controls.password.value;
    const confirmPassword = control.controls.confirmPassword.value;
    if(password !== confirmPassword){
      return {'passwordsMatchValidator': true}
    }
    return null;
  };