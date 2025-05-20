# 🎮 Videojuego Educativo 3D – Proyecto Integrador Calidad de Software

## 📚 Universidad Cooperativa de Colombia  
**Programa:** Ingeniería de Software – Cuarto Semestre  
**Asignatura:** Calidad de Software  
**Docente:** Gustavo Sánchez Rodríguez  

**Estudiantes:**  
- Juan David Maya Benavides  
- Jack Anderson Limas Solarte  

📍 **Sede:** Pasto, Nariño – Colombia  
🗓️ **Fecha:** Mayo de 2025  

---

## 📝 Descripción General

Este proyecto hace parte del trabajo integrador de la asignatura Calidad de Software. Se trata de un **videojuego educativo 3D en primera persona**, desarrollado con tecnologías web modernas como **React**, **Three.js**, **Express** y **MongoDB**, diseñado como herramienta promocional para una marca tecnológica, cumpliendo principios de marketing experiencial.

El sistema fue sometido a un proceso completo de aseguramiento de calidad de software bajo el modelo **ISO/IEC 25010**, evaluando desde pruebas unitarias hasta pruebas de rendimiento y despliegue automatizado.

---

## 🔗 Enlaces Relevantes

- 🔧 **Repositorio del proyecto (GitHub):**  
  https://github.com/Jack-Limas/game-proyect-1-player.git

- 🌐 **Despliegue en producción (Vercel):**  
  https://vercel.com/jack-limas-projects/game-proyect-1-player

---

## 🧪 Tipos de Pruebas Realizadas

| Tipo de Prueba           | Herramienta      | Descripción |
|--------------------------|------------------|-------------|
| **Unitarias**            | Vitest           | Validación de componentes React como `Robot.js` |
| **Integración**          | Postman          | Validación de endpoints API REST en Express |
| **Sistema / Rendimiento**| Apache JMeter    | Simulación de usuarios concurrentes (100 peticiones) |
| **Implantación**         | Manual (Vercel)  | Validación del sistema en entorno productivo |
| **Automatizadas (CI/CD)**| Jenkins + Ngrok  | Pipeline para pruebas y build en cada push |

---

## 📊 Métricas de Calidad (ISO/IEC 25010)

| Métrica                        | Resultado Esperado | Resultado Obtenido |
|-------------------------------|--------------------|--------------------|
| Tiempo de carga inicial       | < 3 segundos       | ✅ 2.3 segundos     |
| Latencia del API              | < 500 ms           | ✅ 140–180 ms       |
| Errores bajo carga (JMeter)   | 0%                 | ✅ 0%               |
| Cobertura de pruebas          | ≥ 80%              | ✅ Aprobado         |
| Experiencia visual/audio      | Sin errores        | ✅ Fluida           |

---

## ⚙️ Tecnologías Utilizadas

- **Frontend:** React, Three.js
- **Backend:** Node.js, Express
- **Base de Datos:** MongoDB
- **Pruebas:** Vitest, Postman, JMeter
- **CI/CD:** Jenkins, Ngrok, GitHub
- **Despliegue:** Vercel

---

## 📁 Estructura del Proyecto

game-proyect-1-player/
├── frontend/ # Juego en React + Three.js
│ ├── components/
│ ├── scenes/
│ └── styles/
├── backend/ # Servidor Express y lógica API
│ └── routes/
├── public/ # Modelos y assets estáticos
├── tests/ # Pruebas unitarias (Vitest)
├── .env.example # Variables de entorno
├── jenkinsfile # CI/CD pipeline
└── README.md # Documento actual

---

## 🛠️ Instrucciones para Ejecutar Localmente

### 1. Clona el repositorio

```bash
git clone https://github.com/Jack-Limas/game-proyect-1-player.git
cd game-proyect-1-player

2. Instala las dependencias
bash
Copiar
Editar
npm install

3. Configura las variables de entorno
Crea un archivo .env basado en .env.example y agrega tus variables necesarias (conexión a MongoDB, puertos, etc.).

4. Inicia el entorno de desarrollo
bash
Copiar
Editar
npm run dev

5. Ejecuta las pruebas unitarias
bash
Copiar
Editar
npm run test

✅ Verificaciones Funcionales (Resumen)
 El juego inicia correctamente desde Vercel

 El personaje se mueve con las teclas de dirección

 Se reproducen sonidos ambientales

 Los premios y bloques 3D se cargan dinámicamente desde la API

 No hay errores visuales o en consola

📌 Observaciones Adicionales
Se utilizaron pipelines automatizados con Jenkins para validar el código antes del despliegue.

Se configuró Ngrok para simular webhooks de GitHub y activar el CI/CD automáticamente.

El backend soporta operaciones básicas CRUD sobre bloques del juego con conexión a MongoDB Atlas.

Se recomienda usar navegadores modernos como Google Chrome para una mejor experiencia 3D.

🧑‍🏫 Conclusión
Este proyecto demuestra la implementación práctica de los principios de calidad de software, aplicando métricas, pruebas automatizadas, integración continua y estándares internacionales. La experiencia inmersiva del videojuego educativo evidencia la solidez del desarrollo y la colaboración técnica.
📩 Contacto
Para más información o comentarios sobre este proyecto:

Juan David Maya Benavides

Jack Anderson Limas Solarte

Universidad Cooperativa de Colombia – Ingeniería de Software