import { Component } from '@angular/core';
import { FirebaseService } from 'src/app/servicios/firebase.service';
import { NotificacionesService } from 'src/app/servicios/notificaciones.service';
import { SweetalertService } from 'src/app/servicios/sweetalert.service';


@Component({
  selector: 'app-mayor-menor',
  templateUrl: './mayor-menor.component.html',
  styleUrls: ['./mayor-menor.component.css']
})
export class MayorMenorComponent {

  mazo: any = [
    { palo: 'basto', numero: 1 },
    { palo: 'basto', numero: 2 },
    { palo: 'basto', numero: 3 },
    { palo: 'basto', numero: 4 },
    { palo: 'basto', numero: 5 },
    { palo: 'basto', numero: 6 },
    { palo: 'basto', numero: 7 },
    { palo: 'basto', numero: 8 },
    { palo: 'basto', numero: 9 },
    { palo: 'basto', numero: 10 },
    { palo: 'basto', numero: 11 },
    { palo: 'basto', numero: 12 },
    { palo: 'espada', numero: 1 },
    { palo: 'espada', numero: 2 },
    { palo: 'espada', numero: 3 },
    { palo: 'espada', numero: 4 },
    { palo: 'espada', numero: 5 },
    { palo: 'espada', numero: 6 },
    { palo: 'espada', numero: 7 },
    { palo: 'espada', numero: 8 },
    { palo: 'espada', numero: 9 },
    { palo: 'espada', numero: 10 },
    { palo: 'espada', numero: 11 },
    { palo: 'espada', numero: 12 },
    { palo: 'copa', numero: 1 },
    { palo: 'copa', numero: 2 },
    { palo: 'copa', numero: 3 },
    { palo: 'copa', numero: 4 },
    { palo: 'copa', numero: 5 },
    { palo: 'copa', numero: 6 },
    { palo: 'copa', numero: 7 },
    { palo: 'copa', numero: 8 },
    { palo: 'copa', numero: 9 },
    { palo: 'copa', numero: 10 },
    { palo: 'copa', numero: 11 },
    { palo: 'copa', numero: 12 },
    { palo: 'oro', numero: 1 },
    { palo: 'oro', numero: 2 },
    { palo: 'oro', numero: 3 },
    { palo: 'oro', numero: 4 },
    { palo: 'oro', numero: 5 },
    { palo: 'oro', numero: 6 },
    { palo: 'oro', numero: 7 },
    { palo: 'oro', numero: 8 },
    { palo: 'oro', numero: 9 },
    { palo: 'oro', numero: 10 },
    { palo: 'oro', numero: 11 },
    { palo: 'oro', numero: 12 },
  ];

  carta: string = '../../../../assets/imagenes/juegos/mayorMenor/mazoCartas.png';
  textoDelBotonJugar: string = 'Jugar';
  mensajePerdio: string = '¡PERDISTE!';
  gano: boolean = false;
  estaJugando: boolean = false;
  termino: boolean = false;
  cartaEnPartida: any = null;
  mazoJuego: any = [];
  intentos: number = 5;
  cantidadDePuntos: number = 0;
  numeroEnPartida: number = 0;
  indiceEnPartida: number = 0;

  constructor(private notificaciones: NotificacionesService, private notificacionesSweet: SweetalertService , public firebase: FirebaseService) {}

  ngOnInit()
  {

  }

  Jugar(mayorMenor: string) 
  {
    this.indiceEnPartida++;
    this.intentos--;
    const previousNumber: number = this.numeroEnPartida;
    this.cartaEnPartida = this.mazoJuego[this.indiceEnPartida];
    this.numeroEnPartida = this.cartaEnPartida.numero;
    this.carta = `../../../../assets/imagenes/juegos/mayorMenor/${this.cartaEnPartida.palo}/${this.cartaEnPartida.numero}.png`;

    if(mayorMenor == "mayor")
    {
      if (previousNumber > this.numeroEnPartida) 
      {
        this.cantidadDePuntos++;
        this.notificaciones.NotificarConToast('Bien ya lo tienes!!, Es Mayor.', "toast-success");
      } 
      else if (previousNumber === this.numeroEnPartida) 
      {
       this.notificaciones.NotificarConToast('Las cartas son iguales', "toast-info");
      } 
      else 
      {
        this.notificaciones.NotificarConToast('Es Mayor, probemos de vuelta!', "toast-error");
      }
    }
    else
    {
      if (previousNumber < this.numeroEnPartida) 
      {
        this.cantidadDePuntos++;
        this.notificaciones.NotificarConToast('Bien ya lo tienes!!, Es menor.', "toast-success");
      } 
      else if (previousNumber === this.numeroEnPartida) 
      {
        this.notificaciones.NotificarConToast('Las cartas son iguales', "toast-info");
      } 
      else 
      {
        this.notificaciones.NotificarConToast('Es Menor, probemos de vuelta!', "toast-error");
      }
    }

    this.ControlarPuntos();
  } 

  Reiniciar() 
  {
    this.intentos = 5;
    this.gano = false;
    this.estaJugando = true;
    this.termino = false;
    this.mensajePerdio = '¡HAS PERDISTE!';
    this.cantidadDePuntos = 0;
    this.indiceEnPartida = 0;
    this.textoDelBotonJugar = 'Reiniciar Juego';
    this.mazo.sort(() => Math.random() - 0.5);
    this.mazoJuego = this.mazo.slice(0, 11);
    this.cartaEnPartida = this.mazoJuego[this.indiceEnPartida];
    this.numeroEnPartida = this.cartaEnPartida.numero;
    this.carta = `../../../../assets/imagenes/juegos/mayorMenor/${this.cartaEnPartida.palo}/${this.cartaEnPartida.numero}.png`;
    this.notificacionesSweet.MostrarMsjSweetAlert("Empezo el juego", 'Mayor Menor',"success");
  }

  ControlarPuntos()
  {
    if (this.indiceEnPartida === 5) 
    {
      this.estaJugando = false;
      this.termino = true;

      if (this.cantidadDePuntos >= 3) 
      {
        this.gano = true;
        this.mensajePerdio = '¡HAS GANASTE!';
        this.firebase.GuardarResultado(this.cantidadDePuntos, "mayor o menor");
        this.notificacionesSweet.MostrarMsjSweetAlert("Gracias por jugar", 'Has Ganado',"success");
      } 
      else 
      {
        this.firebase.GuardarResultado(this.cantidadDePuntos, "mayor o menor");
        this.notificacionesSweet.MostrarMsjSweetAlert("Gracias por jugar", 'Has perdido',"error");
      }
    }
  }
}
