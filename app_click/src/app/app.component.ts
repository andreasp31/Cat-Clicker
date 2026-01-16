import { Component } from '@angular/core';
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

  userData = {
    nombre: '',
    contador: ''
  };

  abrirModal(){
    this.modalAbierto = true;
  }

  cerrarModal(){
    this.modalAbierto = false;
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
