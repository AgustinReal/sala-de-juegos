import { Component } from '@angular/core';
import { FirebaseService } from 'src/app/servicios/firebase.service';
import { NotificacionesService } from 'src/app/servicios/notificaciones.service';
import { SweetalertService } from 'src/app/servicios/sweetalert.service';

@Component({
  selector: 'app-ahorcado',
  templateUrl: './ahorcado.component.html',
  styleUrls: ['./ahorcado.component.css']
})
export class AhorcadoComponent {

  palabras: string[] = 
  [
    'NEYMAR','MESSI','RONALDO','SALAH', 'RIQUELME','MARADONA',
  ];

  palabra: string = '';
  victoria: boolean = false;
  estaActivo: boolean = true;
  imagenes: number | any = 1;
  intentosPosibles: number = 7;
  puntos: number = 0;
  guion: string[] = [];
  letrasBoton: string[] = 
  [
    'A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z',
  ];


  constructor(private notificaciones: NotificacionesService, private notificacionesSweet: SweetalertService , public firebase: FirebaseService) 
  {
    this.palabra = this.palabras[Math.round(Math.random() * (this.palabras.length - 1))];
    this.guion = Array(this.palabra.length).fill('_');
  }

  Reiniciar() 
  {
    this.palabra = this.palabras[Math.round(Math.random() * (this.palabras.length - 1))];
    this.guion = Array(this.palabra.length).fill('_');
    this.puntos = 0;
    this.imagenes = 1;
    this.victoria = false;
    this.estaActivo = true;
    this.intentosPosibles = 7;
    this.ResetearBotones();
    this.notificacionesSweet.MostrarMsjSweetAlert('Reiniciando partida...', 'Ahorcado',"success");
  }

  ResetearBotones()
  {
    for (let index = 0; index < this.letrasBoton.length; index++) 
    {
      const elemento = document.getElementById("boton"+index) as HTMLButtonElement;

      elemento?.classList.remove("btn-error");
      elemento?.classList.remove("btn-acierto");
      elemento?.classList.add("btn-letra");

      if(elemento!=null)
      {
        elemento.disabled = false;
      }
    }
  }

  ElegirLetra(letra: string, idDelBoton:number) 
  {
    let FlagLetra: boolean = false;
    let gano: boolean = false;

    if (this.estaActivo)
    {
      const adivinoFlag: boolean = this.guion.some((c) => c === letra);

      for (let i = 0; i < this.palabra.length; i++) 
      {
        const letraAux = this.palabra[i];

        if (letraAux === letra && !adivinoFlag)
        {
          this.guion[i] = letra;
          FlagLetra = true;
          this.puntos++;
          gano = this.guion.some((unGuion) => unGuion == '_');

          if (!gano) 
          {
            this.imagenes = this.AdivinoElJugador(this.palabra);
            this.estaActivo = false;
            this.victoria = true;
            this.notificacionesSweet.MostrarMsjSweetAlert('Has completado la palabra con exitos', 'Ganaste!!',"success");
            this.firebase.GuardarResultado(this.puntos, "ahorcado");
            break;
          }
        }
      }

      if (!FlagLetra && !adivinoFlag) 
      {
        if (this.intentosPosibles > 0) 
        {
          this.intentosPosibles--;
          this.imagenes++;
          this.notificaciones.NotificarConToast('Uhh, intenta con otra.', "toast-error");
          const elemento = document.getElementById("boton"+idDelBoton) as HTMLButtonElement;
          elemento?.classList.remove("btn-letra");
          elemento?.classList.add("btn-error");

          if(elemento!=null)
          {
            elemento.disabled = true;
          }

          if (this.intentosPosibles === 0) 
          {
            this.notificacionesSweet.MostrarMsjSweetAlert(`El jugador era: ${this.palabra}`, 'Ahorcado :(',"error");
            this.firebase.GuardarResultado(this.puntos, "ahorcado");
            this.estaActivo = false;
          }
        }

        if (this.puntos > 0) 
        {
          this.puntos--;
        }
      } 
      else if (adivinoFlag) 
      {
        this.notificaciones.NotificarConToast('Esa letra ya fue utilizada.', "toast-warning");
      } 
      else if (FlagLetra) 
      {
        if(!this.victoria) 
        {
          this.notificaciones.NotificarConToast('Bien ya lo tienes!!.', "toast-success");
          const elemento = document.getElementById("boton"+idDelBoton) as HTMLButtonElement;
          elemento?.classList.remove("btn-letra");
          elemento?.classList.add("btn-acierto");
          if(elemento!=null)
          {
            elemento.disabled = true;
          }
        }
      }
    } 
    else 
    {
      this.notificaciones.NotificarConToast('Nos quedamos sin intentos..', "toast-info");
    }
  } 

  AdivinoElJugador(palabra: string): number
  {
    let numero: number  = 0;
    switch(palabra)
    {
      case "MESSI":
        numero = 9;
        break;
      case "SALAH":
        numero = 10;
        break;
      case "NEYMAR":
        numero = 11;
        break;
      case "RONALDO":
        numero = 12;
       break;
      case "RIQUELME":
        numero = 13;
        break;
      case "MARADONA":
        numero = 14;
       break;
    }

    return  numero;
  }

  AyudarAlUsuario()
  {
    switch(this.palabra)
    {
      case "MESSI":
        this.notificacionesSweet.MostrarMsjSweetAlert("Jugo en el Barcelona, el Goat", 'Es argentino',"info");
        break;
      case "SALAH":
        this.notificacionesSweet.MostrarMsjSweetAlert("Juega en el Liverpool", 'Es egipcio',"info");
        break;
      case "NEYMAR":
        this.notificacionesSweet.MostrarMsjSweetAlert("Jugo en el PSG", 'Es brasilero',"info");
        break;
      case "RONALDO":
        this.notificacionesSweet.MostrarMsjSweetAlert("Apodo Mr.Champions, el bicho.. siu!!", 'Es portugues',"info");
       break;
      case "RIQUELME":
        this.notificacionesSweet.MostrarMsjSweetAlert("Jugo en Boca, gano 3 libertadores, el ultimo romantico..", 'Es argentino',"info");
        break;
      case "MARADONA":
        this.notificacionesSweet.MostrarMsjSweetAlert("Hizo el mejor gool de la historia de los mundiales.", 'Es argentino',"info");
       break;
    }
  }
}
