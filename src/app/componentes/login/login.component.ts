import { publishFacade } from '@angular/compiler';
import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Route, Router } from '@angular/router';
import { FirebaseService } from 'src/app/servicios/firebase.service';
import { NotificacionesService } from 'src/app/servivicios/notificaciones.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent 
{
  public constructor(private fb:FormBuilder, private firebase: FirebaseService, private router:Router, private notificaciones: NotificacionesService){}
  
  public formularioIngreso=this.fb.group(
  {
    'emailControl': ['ingrese el correo: ', [Validators.required, Validators.email]],
    'claveControl': ['', [Validators.required, Validators.minLength(6)]],
    'claveConfirmacionControl': ['', [Validators.required, Validators.minLength(6)]],
  }, 
  {validators : this.clavesIgualesValidator}
);
  ngOnInit()
  {
    console.log(this.formularioIngreso.controls);
  }

  get email()
  {
    return this.formularioIngreso.get('emailControl') as FormControl;
  }

  get clave()
  {
    return this.formularioIngreso.get('claveControl') as FormControl;
  }

  get claveConfirmacion()
  {
    return this.formularioIngreso.get('claveConfirmacionControl') as FormControl;
  }

  async Ingreso()
  {
    try 
    {
      const user = await  this.firebase.IniciarSesionCorreoClave(this.email.value, this.clave.value);

      if (user != null)
      {
        this.router.navigateByUrl("bienvenido");
      }
    }
    catch(error: any)
    {
      switch (error.code) 
      {
        case 'auth/user-not-found':
          this.notificaciones.toastNotificationWarning('El usuario no se encuentra registrado.');
          break;
        case 'auth/wrong-password':
          this.notificaciones.toastNotificationWarning('Combinacion de Clave y correo electronico erronea.');
          break;
        default:
          this.notificaciones.toastNotificationWarning(error);
          this.notificaciones.toastNotificationWarning('Llene ambos campos correo electronico y clave');
          break;
      }
    }
  }

  accesoRapido(usuario:string){
    if(usuario=='Agustin')
    {
      this.email.setValue("agustin@gmail.com");
      this.clave.setValue("123456");
      this.claveConfirmacion.setValue("123456");
    }
    else if(usuario=='administrador') {
      this.email.setValue("admin@gmail.com");
      this.clave.setValue("123456");
      this.claveConfirmacion.setValue("123456");
    }
    else if(usuario=='cliente') {
      this.email.setValue("cliente@gmail.com");
      this.clave.setValue("123456");
      this.claveConfirmacion.setValue("123456");
    }
  }

  private clavesIgualesValidator(group: FormGroup): null | object
  {
    const claveIngreso : string = group.get('claveControl')?.value;
    const claveConfirmacion : string = group.get('claveConfirmacionControl')?.value;

    if (claveIngreso !== claveConfirmacion)  
    {
      return {'diferente': true};
    }
    else
    {
      return null;
    }
  }
}
