import cv2
from pyzbar.pyzbar import decode
import json

img_path = 'qr_prueba.png' 
img = cv2.imread(img_path)

if img is None:
    print(f"No se pudo cargar la imagen desde '{img_path}'. Asegúrate de que la ruta sea correcta.")
else:
    decoded_objects = decode(img)

    for obj in decoded_objects:
        print("Tipo:", obj.type)
        print("Data:", obj.data.decode("utf-8"))
        print("Rect:", obj.rect)