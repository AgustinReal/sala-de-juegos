import { Component } from '@angular/core';
import { FirebaseService } from 'src/app/servicios/firebase.service';
import { NotificacionesService } from 'src/app/servicios/notificaciones.service';


@Component({
  selector: 'app-chat-app',
  templateUrl: './chat-app.component.html',
  styleUrls: ['./chat-app.component.css']
})
export class ChatAppComponent {

  chatA: boolean = false;
  chatB: boolean = false;
  mensajeNuevo: string ="";
  historialSeleccionado:string ="";
  obser$: any;
  array: any;
  personaLog: boolean = true;

  constructor(public firebase: FirebaseService, private notificaciones: NotificacionesService) { }

  ngOnInit() {
    this.obser$ = this.firebase.TraerHistorial().subscribe(datos =>{
      this.AgregarHistorial(datos);
    });
  }

  ngOnDestroy() {
    if (this.obser$) 
    {
      this.obser$.unsubscribe();
    }
  }

  async EnviarMensaje()
  {
    if(this.mensajeNuevo.length < 22 && this.mensajeNuevo!="")
    {
      this.firebase.GuardarMensaje(this.mensajeNuevo);
      this.mensajeNuevo="";
    }
    else
    {
      this.notificaciones.NotificarConToast("","El mensaje es muy largo, verfique que sea menor de 21 letras.", "Error");
    }
  }

  AgregarHistorial(arrayAux: Array<any>)
  {
    let arrayNuevo =[];

    for (let i = 0; i < arrayAux.length; i++) 
    {
      arrayNuevo.push(arrayAux[i]);
    }

    this.array=arrayNuevo;
  }
}
