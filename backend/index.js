const express = require('express');
const cors = require('cors');
const { OBSWebSocket } = require('obs-websocket-js');
const { execSync } = require('child_process');

// Forzar UTF-8
try {
  execSync("chcp 65001");
} catch (e) {}

const app = express();
const port = 4000;
app.use(cors());
app.use(express.json());

const obs = new OBSWebSocket();
let isConnected = false;

// Mostrar título manual estilo ASCII
console.clear();

console.log(`
 __  __    _    __  __ _____ ____  
|  \\/  |  / \\  |  \\/  | ____/ ___| 
| |\\/| | / _ \\ | |\\/| |  _| \\___ \\ 
| |  | |/ ___ \\| |  | | |___ ___) |
|_|  |_/_/   \\_\\_|  |_|_____|____/ 
           MAMES TOOL
`);
console.log("==============================================================");
console.log(" [!] Esta ventana es necesaria para mantener comunicación con OBS.");
console.log("     Por favor, no la cierres mientras la aplicación esté en uso.");
console.log("==============================================================\n");

console.log(" [OBS TEXT CONTROLLER] - v1.0.0");
console.log(" Desarrollado por Yeriko de Wild Hog Studio");
console.log(" Fecha y hora: " + new Date().toLocaleString());
console.log("--------------------------------------------------------------");

async function connectOBS() {
  if (!isConnected) {
    await obs.connect('ws://localhost:4455', 'vGSmx4P1PcrbgKyx');
    isConnected = true;
    console.log(" [OK] Conectado a OBS vía WebSocket");

  }

}

app.post('/set-text', async (req, res) => {
  const { sourceName, newText } = req.body;
  try {
    await connectOBS();
    await obs.call('SetInputSettings', {
      inputName: sourceName,
      inputSettings: { text: newText },
    });
    console.log(` [->] Texto actualizado en "${sourceName}": "${newText}"`);
    res.send({ success: true });
  } catch (err) {
    console.error(" [X] Error al actualizar texto:", err);
    res.status(500).send({ error: err.message });
  }
});

app.listen(port, () => {
  console.log(`\n [OK] Servidor OBS escuchando en http://localhost:${port}`);
  console.log(" [*] Esperando comandos desde la interfaz web...");
});

//pkg . --out-path dist --targets node18-win-x64