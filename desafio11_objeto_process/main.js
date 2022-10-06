import http from 'http';
import { fork } from 'child_process';

const server = http.createServer();
let visitas = 0;

server.on("request", (req, res) => {
  visitas++;
  let {url} = req;
  const host = req.headers.host;
  const urlParams = new URL(`http://${host}${url}`);

  switch(urlParams.pathname) {
    case "/":
        res.end("visitas: " + visitas)
        break;
    case "/api/randoms":
        const child = fork("./child.js");
        child.send(urlParams.searchParams.get('cant'));
        
        child.on("message", (msg) => {
            res.end(JSON.stringify(msg));
        });
        break;
    default:
        res.end("404");
        break;
  }
});

const PORT = 8080;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});