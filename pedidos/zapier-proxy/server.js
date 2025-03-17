const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const port = 3001; // porta aleatoria

app.use(cors());
app.use(express.json()); // analise do json

app.post('/zapier', async (req, res) => {
    try {
        const zapierUrl = 'https://hooks.zapier.com/hooks/catch/22089640/2la5z8j/'; 
        const response = await axios.post(zapierUrl, req.body);
        res.json(response.data);
    } catch (error) {
        console.error('Erro ao encaminhar para o Zapier:', error);
        res.status(500).json({ error: 'Erro ao encaminhar para o Zapier' });
    }
});

app.listen(port, () => {
    console.log(`Servidor proxy rodando na porta ${port}`);
});