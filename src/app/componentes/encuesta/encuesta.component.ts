import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FirebaseService } from 'src/app/servicios/firebase.service';
import { NotificacionesService } from 'src/app/servicios/notificaciones.service';
import { SweetalertService } from 'src/app/servicios/sweetalert.service';

@Component({
  selector: 'app-encuesta',
  templateUrl: './encuesta.component.html',
  styleUrls: ['./encuesta.component.css']
})
export class EncuestaComponent {

  valorCalificacion: string ="";

  constructor(private formBuilder: FormBuilder,  private notificaciones: NotificacionesService ,private firebase: FirebaseService, private notificacionesSweet: SweetalertService, private router: Router) { };

  get NombreTxt() {
    return this.formularioEncuesta.get("nombreTxt") as FormControl;
  }

  get ApellidoTxt() {
    return this.formularioEncuesta.get("apellidoTxt") as FormControl;
  }

  get EdadTxt() {
    return this.formularioEncuesta.get("edadTxt") as FormControl;
  }

  get CalificacionRadio() {
    return this.formularioEncuesta.get("calificacion") as FormControl;
  }

  get Telefono() {
    return this.formularioEncuesta.get("telefonoTxt") as FormControl;
  }

  get ComentarioTxt() {
    return this.formularioEncuesta.get("comentarioTxt") as FormControl;
  }


  public formularioEncuesta = this.formBuilder.group(
    {
      'nombreTxt': ['', [Validators.required, this.validarEspaciosVacios, Validators.pattern('^[A-Za-z]+$')]],
      'apellidoTxt': ['', [Validators.required, this.validarEspaciosVacios, Validators.pattern('^[A-Za-z]+$')]],
      'edadTxt': ['', [Validators.required, this.validarEspaciosVacios, Validators.pattern('^[0-9]+$'), Validators.min(18), Validators.max(99)]],
      'telefonoTxt': ['', [Validators.required, this.validarEspaciosVacios, Validators.maxLength(10), Validators.pattern('^[0-9]+$')]],
      'calificacion':['', [Validators.required]],
      'comentarioTxt': ['', [Validators.required, this.validarEspaciosVacios, Validators.pattern('^[A-Za-z]+$')]],
    }
  );

  private validarEspaciosVacios(control: AbstractControl): null | object {
    const nombre = <string>control.value;
    const spaces = nombre.includes(' ');

    return spaces
      ? { containsSpaces: true }
      : null;
  }

  IndicarCalificacion(calificacion: string)
  {
    switch (calificacion) {
      case "1":
        this.valorCalificacion = "1";
        this.CalificacionRadio.setValue('1');
        break;
        case "2":
          this.valorCalificacion = "2";
          this.CalificacionRadio.setValue('2');

        break;
        case "3":
          this.valorCalificacion = "3";
          this.CalificacionRadio.setValue('3');

        break;
        case "4":
          this.valorCalificacion = "4";
          this.CalificacionRadio.setValue('4');

        break;
        case "5":
          this.valorCalificacion = "5";
          this.CalificacionRadio.setValue('5');

        break;
    }
  }

  obtenerValorCheckBox() {
    const checkboxes = document.querySelectorAll('input[name="juegos"]:checked');
    const selectedValues: string[] = [];

    checkboxes.forEach((value: Element) => {
      const checkbox = value as HTMLInputElement; // Conversión explícita
      selectedValues.push(checkbox.value);
    });

    return selectedValues;
  }

  enviarEncuesta() {

    if (this.valorCalificacion == "") {
      this.notificaciones.NotificarConToast('Califique la App.', "toast-warning");
    }

    let encuesta = {
      nombre: this.NombreTxt.value,
      apellido: this.ApellidoTxt.value,
      edad: this.EdadTxt.value,
      telefono: this.Telefono.value,
      calificacionPagina: this.valorCalificacion,
      juegosMasDificil: this.obtenerValorCheckBox(),
      comentario: this.ComentarioTxt.value,
    }


    this.firebase.GuardarEncuesta(encuesta);

    this.notificacionesSweet.MostrarMsjSweetAlert("","Exitos", "success");
    this.router.navigateByUrl("home");
  }
}
