import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  segundos = 10;
  tiempoAcabado = false;
  contador=0;
  modalAbierto = false;
  modalAbierto2  = false;
  nombreJugador: string = "";

  abrirModal(){
    this.modalAbierto = true;
  }

  cerrarModal(){
    this.modalAbierto = false;
  }

  abrirModal2(){
    this.modalAbierto2 = true;
  }

  cerrarModal2(){
    this.modalAbierto2 = false;
  }

  incrementarClick(){

    if(this.tiempoAcabado){
      return;
    }
    if(this.contador === 0){
      this.iniciarTemporizador();
    }
    this.contador++;
  }

  iniciarTemporizador(){
    setInterval(()=>{
      this.segundos--;
      if(this.segundos <=0){
        this.tiempoAcabado = true;
        this.segundos = 0;
      }
    },1000);
  }
}
