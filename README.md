# Proyecto Biometria y Medio Ambiente / Sprint 0

Este proyecto integra un **dispositivo Arduino** que actúa como **emisora iBeacon** mediante Bluetooth Low Energy (BLE), y una **aplicación Android** desarrollada en **Android Studio** que permite detectar y procesar las tramas emitidas.

---

## 📌 Descripción

Este proyecto forma parte del módulo **"Biometría y Medio Ambiente"** del Grado en Tecnologías Interactivas (GTI-UPV).
El sistema completo mide y publica **niveles de CO₂ y contador de emisiones BLE** mediante un **beacon nRF52840 (Arduino)** que envía tramas *iBeacon* detectadas por una **app Android**.  
Los datos se almacenan en una **base de datos MySQL** gestionada por un **servidor Node.js/Express** y se muestran en una **interfaz web en tiempo real**.
---

## 🗃️ Contenidos

- 📂doc

- 📂src
- - 📁 Arduino/ # Código fuente de la placa nRF52840
- - 📁 AndroidApp/ # Aplicación Android Studio (detección BLE)
- - 📂 Servidor/ # Backend Node.js + MySQL
  - 📂apiREST/
  - - ReglasRest.js
  - - 📁Test
    - mainTestAPI.js
    -   - apiREST/
  - 📂Logica/
    - -Logica.js
  - - 📁Test
    - mainTestLogica.js
 - mainServidorREST.js
- - 📂Ux # Interfaz para visualizar los datos
  - Index.js
  - - 📁Css
    - index.css
  - - 📁 Js
    - index.js

---

## 🛠️ Tecnologías usadas

- **Arduino/C++:** Placa sensor (SparkFun nRF52832) y emisor de datos.
- **Android Studio/Java:** app movil para detectar/escanear señales BLE.
- **Node.js + express:** servidor API REST
- **Mocha:** Test de comprobación de reglasREST y la Logica para la base de datos y el servidor.
- **MySQL:** con XAMPP (phpMyAdmin).
- **Figma:** Herramienta para el diseño del codigo.
- **GitHub:** Gestión del repositorio del proyecto.
- **Trello:** Organización del protecto.

---
## 🚀 Despliegue del Proyecto

El sistema completo se despliega **en entorno local**, sin necesidad de servicios en la nube ni Plesk por ahora en un futuro se espera usar los servicios de Plesk.  
Todo se ejecuta dentro de la misma red WiFi (por ejemplo, el portátil y el móvil conectados al mismo router).
El backend está formado por un **servidor REST** desarrollado con **Node.js** y **Express**, que se comunica con una base de datos **MySQL** local.  
1. Asegúrate de tener MySQL instalado (por ejemplo en el puerto 3307).  
2. Crea la base de datos y tabla necesarias: 
- CREATE TABLE medidas (
     id INT AUTO_INCREMENT PRIMARY KEY,
     uuid VARCHAR(50),
     gas FLOAT,
     contador INT,
     fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );

 3. Arrancar mainServidorREST.js desde terminal con node mainServidorREST.js


---
## 🧪 Ejecución de Tests

El proyecto incluye **dos conjuntos de pruebas independientes**, desarrollados con **Mocha** y **Request**, que validan tanto la **API REST** como la **lógica de base de datos** por separado.

### 🧩 Tipos de tests

| Archivo | Descripción |
|----------|--------------|
| **mainTestAPI.js** | Verifica las rutas REST (`POST /medida`, `GET /medidas`), la validación de JSON y el comportamiento del servidor. |
| **mainTestLogica.js** | Comprueba directamente la clase `Logica.js` y las consultas MySQL (inserción, listado, conexión, etc.). |

### ▶️ Cómo ejecutarlos

1. Asegúrate de tener el servidor MySQL en marcha y la base de datos `proy` configurada.  
2. Abre una terminal dentro de la carpeta que contiene los tests.  
3. Ejecuta las pruebas correspondientes con Mocha:

   ```bash
   # Para probar la API REST
   npx mocha mainTestAPI.js

   # Para probar la lógica de negocio directamente
   npx mocha mainTestLogica.js


---
## 📑 Diseños de los códigos.

La clave principal del sprint 0, es la ingenieria inversa, dado los códigos proporcionados se tiene que analizar y entender cual es la funcionalidad de cada clase y en su conjunto. Una vez realizada esa tarea se deben hacer los diseños correspondientes, para ello se ha usado FIGMA.

Enlace de FIGMA: https://www.figma.com/board/TTPIud9HTwg02mrUyJJg70/Diagramas-proyecto-de-Biometria?node-id=0-1&t=g7mkOzzyFAyrCvH3-1
