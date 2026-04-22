const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const path = require('path');

const app = express();

//middlewares
app.use(cors());
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

//Aiven
const pool = new Pool({
    host: 'pg-108a9058-tec-cffc.k.aivencloud.com',
    port: 14269,
    user: 'avnadmin',
    password: 'AVNS_Sj28D3bjOBYlTuMY2YO',
    database: 'GaelZ',
    ssl: {
        rejectUnauthorized: false
    }
});

//Ruta para el Login
app.post('/login', async (req, res) => {
    const { username, password } = req.body; 
    
    // Agregamos este log para que veas en la terminal si llegan los datos
    console.log("Intento de login para el usuario:", username);

    try {
        const result = await pool.query(
        'SELECT id FROM "usuarios_juego" WHERE "username" = $1 AND "password" = $2',
    [username, password]
        );

        if (result.rows.length > 0) {
            res.json({ success: true, userId: result.rows[0].id });
        } else {
            res.status(401).json({ success: false, message: 'Usuario o contraseña incorrectos' });
        }
    } catch (err) {
        // ESTA LÍNEA ES CLAVE: Mira tu terminal de VS Code después de fallar
        console.log("--- ERROR DETECTADO ---");
        console.error(err); 
        console.log("-----------------------");

        res.status(500).json({ success: false, message: 'Error interno: ' + err.message });
    }
});

//Ruta para que Unity guarde los puntos del jugador
app.post('/update-score', async (req, res) => {
    const { userId, score } = req.body; 

    try {
        await pool.query(
            'UPDATE "usuarios_juego" SET "score" = $1 WHERE "id" = $2',
            [score, userId]
        );
        console.log(`Puntos guardados: Usuario ${userId} tiene ${score} pts`);
        res.json({ success: true, message: "Puntuación guardada" });
    } catch (err) {
        console.error("Error al guardar puntos:", err);
        res.status(500).json({ success: false, message: "Error al guardar en BD" });
    }
});

//Levantar el servidor
app.listen(8080, () => {
    console.log("¡Servidor vivo en http://localhost:8080!");
});