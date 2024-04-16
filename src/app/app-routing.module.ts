import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './componentes/login/login.component';
import { RegistroComponent } from './registro/registro.component';
import { HomeComponent } from './componentes/home/home.component';
import { QuienComponent } from './componentes/quien/quien.component';

const routes: Routes = 
[
  
  {path:"registro", title:"Registro", component:RegistroComponent}, 
  {path:"login", title:"Incio sesion", component:LoginComponent},
  {path:"quienSoy", title:"Presentación", component:QuienComponent},
  {path:"**", title:"Home", component:HomeComponent},
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { 
  
}
