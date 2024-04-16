import {AfterViewInit, Component, OnInit} from '@angular/core';

import {Food} from "./game-engine/food";
import {Snake} from "./game-engine/snake";
import {outsideGrid} from "./game-engine/gameboard-grid.util";
import { SweetalertService } from 'src/app/servicios/sweetalert.service';
import { Router } from '@angular/router';
import { FirebaseService } from 'src/app/servicios/firebase.service';


@Component({
  selector: 'app-disparos',
  templateUrl: './disparos.component.html',
  styleUrls: ['./disparos.component.css']
})


export class DisparosComponent implements OnInit, AfterViewInit {
  title = 'snakeGame1938web';
  gameBoard: any;
  snake = new Snake();
  food = new Food(this.snake);

  lastRenderTime = 0;
  gameOver = false;

  constructor(private notificacionesSweet: SweetalertService, private router:Router, public firebase: FirebaseService,)
  {

  }

  ngAfterViewInit() {
    this.gameBoard = document.querySelector('.game-board');
    window.requestAnimationFrame(this.start.bind(this));
  }

  ngOnInit(): void {
    this.notificacionesSweet.MostrarMsjSweetAlert('Presione las flequitas para jugar.', 'Bienvenido',"success");
    this.snake.listenToInputs();
  }
  
  Reiniciar()
  {
    this.notificacionesSweet.MostrarMsjSweetAlert('Presione las flequitas para jugar.', 'A Jugar',"success");
    this.snake = new Snake();
    this.food = new Food(this.snake);
    this.gameOver= false;
    window.requestAnimationFrame(this.start.bind(this));
    this.snake.listenToInputs();
  }

  start(currentTime: any) {
    if (this.gameOver) {
      this.firebase.GuardarResultado(this.food.score, "viborita");
      this.gameOver= true;
      return this.notificacionesSweet.MostrarMsjSweetAlert('vuelve a intentarlo', 'Has Perdido',"error");
    }

    window.requestAnimationFrame(this.start.bind(this));
    const secondsSinceLastRender = (currentTime - this.lastRenderTime) / 1000;
    if (secondsSinceLastRender < 1 / this.snakeSpeed) {
      return;
    }
    this.lastRenderTime = currentTime;

    this.update();
    this.draw();
  }

  update() {
    this.snake.update();
    this.food.update();
    this.checkDeath();
  }

  draw() {
    this.gameBoard.innerHTML = '';
    this.snake.draw(this.gameBoard);
    this.food.draw(this.gameBoard);
  }

  checkDeath() {
    this.gameOver = outsideGrid(this.snake.getSnakeHead()) || this.snake.snakeIntersection();
    if (!this.gameOver) {
      return;
    }
    this.gameBoard.classList.add('blur');
  }


  get snakeSpeed() {
    const score = this.food.currentScore;
    if (score < 10) {
      return 4;
    }
    if (score > 10 && score < 15) {
      return 5;
    }
    if (score > 15 && score < 20) {
      return 6;
    }
    return 7;
  }

}

