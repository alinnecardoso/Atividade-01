const app = require('./src/app');

const port = process.env.PORT || 3000;

// 🔑 OUÇA EM TODAS AS INTERFACES (não só localhost)
app.listen(port, '0.0.0.0', () => {
  console.log(`API ouvindo na porta ${port} em 0.0.0.0`);
});
