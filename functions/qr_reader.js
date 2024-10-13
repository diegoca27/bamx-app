import { createCanvas, loadImage } from 'canvas';
import jsQR from 'jsqr';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

async function decodeQrImage(imagePath) {
    try {
        // Verifica que el archivo existe
        if (!fs.existsSync(imagePath)) {
            throw new Error(`El archivo no existe en la ruta: ${imagePath}`);
        }

        const image = await loadImage(imagePath);
        const canvas = createCanvas(image.width, image.height);
        const ctx = canvas.getContext('2d');
        ctx.drawImage(image, 0, 0);

        // Obtén los datos de imagen en formato RGBA
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, canvas.width, canvas.height);

        if (code) {
            console.log(code);
            console.log("Data:", code.data);
            console.log("Rect:", code.location);
        } else {
            console.log("No se pudo encontrar un código QR en la imagen.");
        }
    } catch (error) {
        console.error("Error al cargar la imagen:", error);
    }
}

decodeQrImage('qr_prueba.png');