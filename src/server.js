const express = require('express');
const webhookRoutes = require('./routes/webhookRoutes');

const app = express();
app.use(express.json());

app.use('/', webhookRoutes);

app.get('/', (req, res) => {
  res.send('Webhook funcionando 🚀');
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});