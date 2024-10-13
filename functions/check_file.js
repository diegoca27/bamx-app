import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Obtener el directorio actual correctamente
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Normalizar la ruta del archivo de la imagen
const imgPath = path.join(__dirname, 'qr_prueba.png');

// Verificar si el archivo existe
fs.access(imgPath, fs.constants.F_OK, (err) => {
    if (err) {
        console.error(`El archivo no existe: ${imgPath}`);
    } else {
        console.log(`El archivo existe: ${imgPath}`);
    }
});
