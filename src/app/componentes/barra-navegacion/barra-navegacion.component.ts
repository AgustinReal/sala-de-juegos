import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-barra-navegacion',
  templateUrl: './barra-navegacion.component.html',
  styleUrls: ['./barra-navegacion.component.css']
})
export class BarraNavegacionComponent {

  constructor(private ruter: Router)
  {

  }

  DirigirLogin()
  {
    this.ruter.navigateByUrl("login", { replaceUrl:true });
  }
}
