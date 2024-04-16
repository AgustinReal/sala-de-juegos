import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/servicios/firebase.service';
import { NotificacionesService } from 'src/app/servicios/notificaciones.service';
import { Router } from '@angular/router';
import {SweetalertService} from "src/app/servicios/sweetalert.service";
import { user } from '@angular/fire/auth';

@Component({
  selector: 'app-resgistro',
  templateUrl: './resgistro.component.html',
  styleUrls: ['./resgistro.component.css']
})
export class ResgistroComponent implements OnInit{

  nombreTxt: string="";
  esTexto: boolean = false;
  password:string ="";
  confirmPassword:string ="";
  correoTxt:string="";
  imagenOjo:string="../../../assets/imagenes/imagenesRegistro/ojoAzulCerrado.png";


  constructor(private firebase:FirebaseService, private router: Router, private notificaciones: NotificacionesService, private notificacionesSweet: SweetalertService)
  {

  }

  ngOnInit() {

  }

  togglePasswordVisibility()
  {
    this.esTexto = !this.esTexto;

    if(this.esTexto == true)
    {
      this.imagenOjo = "../../../assets/imagenes/imagenesRegistro/ojoAzulAbierto.png";
    }
    else
    {
      this.imagenOjo = "../../../assets/imagenes/imagenesRegistro/ojoAzulCerrado.png";
    }
  }

  LimpiarCampos()
  {
    this.correoTxt ="";
    this.password ="";
    this.confirmPassword="";
  }

  ValidarCorreoIngresdo(): boolean 
  {
    let booleanValidado: boolean = false;

    if (this.correoTxt.match(/^[\w-.]+@([\w-]+.)+[\w-]{2,4}$/)) {
      booleanValidado = true;
    } 

    return booleanValidado;
  }

  async Registro()
  {
    if(this.password.length == 0 && this.confirmPassword.length == 0 && this.correoTxt.length == 0)
    {
      this.notificaciones.NotificarConToast('Los campos estan vacios', 'toast-error');
    }
    else if(this.password.length >= 6 && this.confirmPassword.length >= 6)
    {
      if(this.password == this.confirmPassword)
      {
        if(this.ValidarCorreoIngresdo()== false)
        {
          this.notificaciones.NotificarConToast('Este correo no cumple con los requisitos.', 'toast-warning');
        }
        else
        {
          const user = {
            nombre: this.nombreTxt,
            correo: this.correoTxt,
            clave: this.password,
          };

          
          try 
          {
            let todoOkRegistro=  this.firebase.RegistrarCorreoClave(user);

            if(todoOkRegistro != null )
            {
              this.firebase.GuardarRegistro(this.correoTxt, user.nombre)
              this.notificacionesSweet.MostrarMsjSweetAlert("", "Bienvenido", "success");
              this.router.navigateByUrl("home");
            }
          }
          catch(error: any)
          {
            switch (error.code) 
            {
              default:
                this.notificaciones.NotificarConToast('Ese correo ya se encuentra en nuestros sistemas.', 'toast-info');
                break;
            }
          }
        }      
      }
      else
      {
        this.notificaciones.NotificarConToast('La contraseña no coinciden.', 'toast-warning');
      }
    }
    else
    {
      this.notificaciones.NotificarConToast('La/s contraseñas con tienen como minimo 6 caracteres.', 'toast-warning');
    }   
  }
}
