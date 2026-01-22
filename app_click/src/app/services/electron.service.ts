import { Injectable } from '@angular/core';
//Error que window no tiene "require" por defecto
declare const window: any;

@Injectable({
  providedIn: 'root'
})
export class ElectronService {
  private ipc: any;

  constructor() {
    if (window.require) {
      this.ipc = window.require('electron').ipcRenderer;
    } else {
      console.warn('Electron IPC no disponible');
    }
  }

  async guardarPuntuacion(nombre: string, clicks: number) {
    return await this.ipc.invoke('guardar_puntuacion', { nombre, clicks });
  }

  async obtenerRanking() {
    return await this.ipc.invoke('obtener-ranking');
  }
}