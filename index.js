const express = require('express');
const app = express();
const path = require('path');

// Esto le dice a Express que busque todo lo visual dentro de "public"
app.use(express.static(path.join(__dirname, 'public')));

app.listen(8080, () => {
    console.log("Servidor corriendo en http://localhost:8080");
});

