import { Component } from '@angular/core';
import { ApiPaisesService } from 'src/app/servicios/api-paises.service';
import { FirebaseService } from 'src/app/servicios/firebase.service';
import { NotificacionesService } from 'src/app/servicios/notificaciones.service';
import { SweetalertService } from 'src/app/servicios/sweetalert.service';

@Component({
  selector: 'app-preguntados',
  templateUrl: './preguntados.component.html',
  styleUrls: ['./preguntados.component.css']
})
export class PreguntadosComponent {

  user: any = null;
  listOfCountries: any = [];
  listOfQuestions: any = [];
  victory: boolean = false;
  activeGame: boolean = false;
  gameOver: boolean = false;
  gameOverText: string = '¡PERDISTE!';
  score: number = 0;
  attempts: number = 5;
  currentQuestion: any = null;
  loadedQuestions: boolean = false;
  currentIndex: number = 0;
  correctAnswer: boolean = false;
  wrongAnswer: boolean = false;

  constructor(private apiPaises: ApiPaisesService, private notificaciones: NotificacionesService, private notificacionesSweet: SweetalertService, public firebase: FirebaseService) 
  {
    this.apiPaises.getPaises();
  }

  async ngOnInit(): Promise<void> {
    const paises = await this.apiPaises.getPaises();
    this.listOfCountries = paises.map((country: any) => {
      return {
        name: country.translations.spa.official,
        flag: country.flags.png,
      };
    });
    this.startGame();
  } 

  startGame() {
    this.generateQuestions();
    this.currentQuestion = this.listOfQuestions[this.currentIndex];
    this.activeGame = true;
    this.notificacionesSweet.MostrarMsjSweetAlert('Juego iniciado', 'Preguntados',"success");
  } // end of startGame

  generateQuestions() {
    this.listOfCountries.sort(() => Math.random() - 0.5);
    this.listOfQuestions = this.listOfCountries
      .slice(0, 10)
      .map((country: any) => {
        const option2 = this.listOfCountries[this.generateRandomNumber()].name;
        const option3 = this.listOfCountries[this.generateRandomNumber()].name;
        const option4 = this.listOfCountries[this.generateRandomNumber()].name;
        const options = [country.name, option2, option3, option4].sort(
          () => Math.random() - 0.5
        );
        return {
          answer: country.name,
          options: options,
          flag: country.flag,
        };
      });
    this.loadedQuestions = true;
  } // end of generateQuestions

  generateRandomNumber() {
    return Math.floor(Math.random() * 249);
  } // end of generateRandomNumber

  play(option: string, event: Event) 
  {
    if (this.activeGame) {
      const btn = <HTMLButtonElement>event.target;
      btn.disabled = true;
      if (option === this.currentQuestion.answer) 
      {
        this.score++;
        this.correctAnswer = true;
        setTimeout(() => {
          this.correctAnswer = false;
        }, 300);
        this.notificaciones.NotificarConToast('¡Adivinaste!', 'toast-success');
      } 
      else 
      {
        this.wrongAnswer = true;
        setTimeout(() => {
          this.wrongAnswer = false;
        }, 300);
        this.notificaciones.NotificarConToast(`No adivinaste!, era ${this.currentQuestion.answer}`, 'toast-info');
      }

      if (this.currentIndex < 9) 
      {
        this.currentIndex++;
        setTimeout(() => {
          this.currentQuestion = this.listOfQuestions[this.currentIndex];
        }, 500);
      }

      if (this.attempts > 0) {
        this.attempts--;
        if (this.attempts === 0) {
          this.activeGame = false;
          this.gameOver = true;
          if (this.score >= 4) {
            this.victory = true;
            this.gameOverText = '¡GANASTE!';
            this.notificacionesSweet.MostrarMsjSweetAlert('GANASTE!', 'Preguntados', "success");
            this.firebase.GuardarResultado(this.score, "preguntados");
          } else {
            this.notificacionesSweet.MostrarMsjSweetAlert('¡PERDISTE!', 'Preguntados', "error");
            this.firebase.GuardarResultado(this.score, "preguntados");
          }
        }
      }
    }
  } 

  restartGame() {
    this.generateQuestions();
    this.currentIndex = 0;
    this.score = 0;
    this.attempts = 5;
    this.activeGame = true;
    this.victory = false;
    this.gameOver = false;
    this.gameOverText = '¡PERDISTE!';
    this.currentQuestion = this.listOfQuestions[this.currentIndex];
    this.notificacionesSweet.MostrarMsjSweetAlert('Juego Reiniciado', 'Preguntados', "success");
  } 

}
