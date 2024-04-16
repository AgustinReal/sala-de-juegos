import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu-juegos',
  templateUrl: './menu-juegos.component.html',
  styleUrls: ['./menu-juegos.component.css']
})
export class MenuJuegosComponent {

  constructor(private router: Router){

  }

  IrAhorcado()
  {
    this.router.navigateByUrl("juegos/ahorcado");
  }

  IrMayorMenor()
  {
    this.router.navigateByUrl("juegos/mayorMenor");
  }

  IrPreguntados()
  {
    this.router.navigateByUrl("juegos/preguntados");
  }

  IrDisparos()
  {
    this.router.navigateByUrl("juegos/disparos");
  }
}
