const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();

// Configurar middleware de CORS
app.use(cors());

// Función para construir la cadena de consulta
function buildQueryString(params) {
    const parts = [];
    for (const key in params) {
        if (Array.isArray(params[key])) {
            // Para cada valor en el array, añade key[]=value a la cadena de consulta
            params[key].forEach(value => {
                parts.push(`${encodeURIComponent(key)}[]=${encodeURIComponent(value)}`);
            });
        } else {
            // Para parámetros no-array, añade key=value a la cadena de consulta
            parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`);
        }
    }
    return parts.join('&');
}

// Configura una ruta proxy
app.use('/api', async (req, res) => {
    const endpoint = 'https://api.vivino.com/vintages/_explore?limit=50&q=cabernet%20sauvignon'; // Reemplaza con tu endpoint
    const queryParams = buildQueryString(req.query);
    const url = `${endpoint}&${queryParams}`;

    try {
        const response = await axios.get(url);
        res.json(response.data);
    } catch (error) {
        res.status(500).send('Error en el servidor proxy');
    }
});

const PORT = 3005;
app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));
