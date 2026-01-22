const { app, BrowserWindow, ipcMain } = require('electron');
const { MongoClient } = require('mongodb');
const path = require('path');
let mainWindow;

//Configuración de la base de datos
const url = 'mongodb+srv://andreasofiapais_db_user:admin123456789@cluster0.dhnz1y7.mongodb.net/'
const dbName = "catClickerDB";
let db;

//Función para concectar con mongoDb atlas al iniciar el juego
async function connectDB() {
  try {
    const client = await MongoClient.connect(url);
    db = client.db(dbName);
    console.log("Conectado a MongoDB");
  } catch (err) {
    console.error("Error al conectar a MongoDB", err);
  }
}

//comunicarse con angular

//Escucha para guardar la nueva puntuación
ipcMain.handle('guardar_puntuacion', async (event, data) => {
  try {
    const collection = db.collection('ranking');
    await collection.insertOne({
      nombre: data.nombre,
      clicks: data.clicks,
      fecha: new Date()
    });
    return { success: true };
  } 
  catch (err) {
    return { success: false, error: err.message };
  }
});

//Escucha y devuelve el top 10 de mejores puntuaciones
ipcMain.handle('obtener-ranking', async () => {
  try {
    const collection = db.collection('ranking');
    //coger los 10 mejores ordenados de mayor a menor
    return await collection.find().sort({ clicks: -1 }).limit(10).toArray();
  } 
  catch (err) {
    return [];
  }
});

//Gestión de la ventana
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1920,
    height: 1080,
    webPreferences: {
      //Permite usar funciones de node en el front
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true
    }
  });

  // Cargar Angular en desarrollo
  mainWindow.loadURL('http://localhost:4200');
  
  // Para desarrollo: abrir DevTools
  mainWindow.webContents.openDevTools();

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}
//Iniiciar el juego
app.whenReady().then(() => {
  //Conectar con la base de datos
  connectDB();
  //Crear la interfaz
  createWindow();
});

//Cerrar el juego cuanto todo se cierre
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
