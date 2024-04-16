import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { JuegosComponent } from './juegos.component';
import { AhorcadoComponent } from 'src/app/componentes/juegos/ahorcado/ahorcado.component';
import { MayorMenorComponent } from 'src/app/componentes/juegos/mayor-menor/mayor-menor.component';
import { PreguntadosComponent } from 'src/app/componentes/juegos/preguntados/preguntados.component';
import { DisparosComponent } from 'src/app/componentes/juegos/disparos/disparos.component';

const routes: Routes = [
  { path: '', component: JuegosComponent,
  children:[
    {path:"ahorcado", component:AhorcadoComponent},
    {path:"mayorMenor", component:MayorMenorComponent},
    {path:"preguntados", component:PreguntadosComponent},
    {path:"disparos", component:DisparosComponent}
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JuegosRoutingModule { }
