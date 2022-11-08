import http from 'http';

const port = 8080;

const server = http.createServer();
  
server.on("request", (req, res) => {
  const pid = process.pid;
  const fecha = new Date(Date.now());

  res.end(`PID: ${pid}}. Fecha: ${fecha}. PORT: ${port}`);
});
  
server.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}. PID: ${process.pid}`);
});