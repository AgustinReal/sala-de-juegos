import { Component, ElementRef, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FirebaseService } from 'src/app/servicios/firebase.service';
import { Observable } from 'rxjs';
import { NotificacionesService } from 'src/app/servivicios/notificaciones.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent {

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  foto1Url: string | null = null;
  public fotoPerfil: any;
  public constructor(
    private fb: FormBuilder,
    private notifiacionS: NotificacionesService,
    private router: Router,
    private firebase: FirebaseService
  ) { }
  async ngOnInit(): Promise<void> {
  }

  onFileDivClick(): void {
    this.fileInput.nativeElement.click();
  }

 

  onFileSelected(event: any, photoId: string) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        if (photoId === 'foto1') {
          this.foto1Url = imageUrl;
        }
      };
      reader.readAsDataURL(file);
    }
  }
  get nombre() {
    return this.formularioRegistroUsuario.get('nombre') as FormControl;
  }

  get apellido() {
    return this.formularioRegistroUsuario.get('apellido') as FormControl;
  }

  get edad() {
    return this.formularioRegistroUsuario.get('edad') as FormControl;
  }
  get dni() {
    return this.formularioRegistroUsuario.get('dni') as FormControl;
  }

  get email() {
    return this.formularioRegistroUsuario.get('email') as FormControl;
  }

  get terminos() {
    return this.formularioRegistroUsuario.get('terminos') as FormControl;
  }

  get clave() {
    return this.formularioRegistroUsuario.get('clave') as FormControl;
  }

  get foto1() {
    return this.formularioRegistroUsuario.get('foto1') as FormControl;
  }

  get upload1() {
    return document.getElementById("foto1") as HTMLInputElement;
  }



  public formularioRegistroUsuario = this.fb.group({
    'nombre': ['', [Validators.required, this.spacesValidator]],
    'apellido': ['', [Validators.required, this.spacesValidator]],
    'edad': ['', [Validators.required, Validators.min(18), Validators.max(99)]],
    'dni': ['', [Validators.required, Validators.pattern(/^[1-9]\d{6,7}$/)]],
    'email': ['', [Validators.required, Validators.email]],
    'terminos': ['', Validators.requiredTrue],
    'clave': ['', [Validators.required, Validators.minLength(6)]],
    'foto1': ['', [Validators.required]],

  });

  private spacesValidator(control: AbstractControl): null | object {
    const nombre = <string>control.value;
    const spaces = nombre.includes(' ');

    return spaces
      ? { containsSpaces: true }
      : null;
  }

  async registrarEspecialista() {
    this.notifiacionS.hideSpinner();
    if (this.formularioRegistroUsuario.valid) {
      if (!await this.firebase.checkIfUserExists(this.email.value)) {
        this.firebase.uploadFiles(this.upload1, "fotoPerfil", this.email.value).then(async () => {

          if (this.email.value != null) {
            this.fotoPerfil = await this.firebase.getDownloadURLFromCollectionPerfil(this.email.value);
            const usuario = {dni:this.dni.value, email:this.email.value, nombre:this.nombre.value, apellido:this.apellido.value, edad:this.edad.value, foto:this.fotoPerfil};
             this.firebase.createUser(usuario, usuario.email, this.clave.value)
               .then(() => {
                 console.log('Usuario registrado con éxito.');
                 this.notifiacionS.hideSpinner();
                 this.router.navigate([""]);
               })
               .catch((error: any) => {
                 this.notifiacionS.hideSpinner();
                 console.error('Error al registrar usuario:', error);
               });
             }
          });
        } else {
          this.notifiacionS.hideSpinner();
          this.notifiacionS.toastNotificationError("El correo ya esta registrado");
        }
      } else {
      this.notifiacionS.hideSpinner();
      this.notifiacionS.toastNotificationWarning('Formulario de registro de usuario no válido.');
    }
  }

}