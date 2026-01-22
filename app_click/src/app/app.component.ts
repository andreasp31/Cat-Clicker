import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ElectronService } from './services/electron.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  //Variables
  segundos = 10;
  tiempoAcabado = false;
  contador=0;
  //modal para guardar el nombre y puntación
  modalAbierto = false;
  //modal para enseñar el ranking
  modalAbierto2  = false;
  nombreJugador: string = "";
  ranking: any[] = [];

  constructor(private electronService: ElectronService) {}

  abrirModal(){
    this.modalAbierto = true;
  }

  cerrarModal(){
    this.modalAbierto = false;
  }
  //al abrir el modal pide los datos a Electron antes de enseñarlo
  async abrirModal2(){
    this.ranking = await this.electronService.obtenerRanking();
    this.modalAbierto2 = true;
  }

  cerrarModal2(){
    this.modalAbierto2 = false;
  }

  //Envia los clicks a electron para guardarlos en mongo
  async guardarDatos() {
  if (this.nombreJugador) {
    await this.electronService.guardarPuntuacion(this.nombreJugador, this.contador);
    this.cerrarModal();
    //Enseña el ranking luego después de guardar
    this.abrirModal2();
  }
}

  incrementarClick(){
    //Si terminó el tiempo no suma más
    if(this.tiempoAcabado){
      return;
    }
    //el primer click inicia la cuenta atrás
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
