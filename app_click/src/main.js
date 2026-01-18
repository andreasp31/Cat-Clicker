const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const Database = require('better-sqlite3');

let mainWindow;
let db = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1920,
    height: 1080,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true
    }
  });

  // Cargar Angular en desarrollo
  mainWindow.loadURL('http://localhost:4200');
  
  // Para desarrollo: abrir DevTools
  mainWindow.webContents.openDevTools();

  //Iniciar base de datos cuando la ventanae esté lista
  mainWindow.webContents.on('did-finish-load',()=>{
    iniciarBase();
  })

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

function iniciarBase(){
  try{
    //Ruta de la base de datos en el directorio de datos de usuario
    const userData = app.getPath('userData');
    const dbPath = path.join(userData,'partidas.db');
    console.log("Base de datos en", dbPath);

    //Conectar a SQLite
    db = new Database(dbPath);

    //Crear tabla para el ranking
    db.exec(`
      CREATE TABLE IF NOT EXISTS ranking (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL,
      clicks INTEGER NOT NULL)`
    )
    console.log("Base de datos inicializada");
  }
  catch(error){
    console.log("Error al inicializar la base de datos", error);
  }
}

ipcMain.on("guardar_partida",(event,{nombre,clicks})=>{
  try{
    const preparar = db.prepare('INSERT INTO ranking (nombre,clicks) VALUES (?,?)');
    const resultado = preparar.run(nombre,clicks);
    console.log("Partida guardada con ID:", resultado.lastInsertRowid);
    event.reply("guardar_partida",{
      success: true,
      id: resultado.lastInsertRowid
    })
  }
  catch(error){
    console.log("Error al guardar partida", error);
    event.reply("guardar_partida",{
      success: false,
      error: error.message
    })
  }
})

ipcMain.on("obtener_ranking",(event)=>{
  try{
    const preparar = db.prepare('SELECT * FROM ranking ORDER BY clicks DESC LIMIT 10');
    const resultado = preparar.all();
    console.log("Ranking obtenido:", resultado);
    event.reply("ranking_obtenido",{
      success: true,
      ranking: resultado
    })
  }
  catch(error){
    console.log("Error al obtener ranking", error);
    event.reply("ranking_obtenido",{
      success: false,
      error: error.message
    })
  }
})

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('before-quit', () => {
  if (db) {
    db.close();
    console.log("Base de datos cerrada");
  }
});