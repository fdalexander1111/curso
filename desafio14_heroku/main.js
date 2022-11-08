import http from 'http';
import os from 'os';
import yargs from 'yargs';
import { fork } from 'child_process';
import cluster from 'cluster';


const server = http.createServer();
const args = yargs(process.argv.slice(2))
  .alias({
    a: "modo",
    p: "puerto",
    d: "debug",
    m: "modo"
  })
  .default({
    ambiente: "dev",
    puerto: 8080,
    debug: false,
    modo: "FORK",
  })
  .argv

const numCPUs = os.cpus().length;
const port = args.puerto;
const mode = args.modo;

let visitas = 0;

if (cluster.isPrimary && mode == "CLUSTER") {

    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    cluster.on("exit", () => {
        console.log(`Worker died ${process.pid}`);
        cluster.fork();
    })

} else {

    const server = http.createServer();

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
     /*   const child = fork("./child.js");
        child.send(urlParams.searchParams.get('cant'));
        
        child.on("message", (msg) => {
            res.end(JSON.stringify(msg));
        });*/
        break;
    case "/info":

       /* console.log("args: " + args._  +  "\n" +
        "io: " + process.platform +  "\n" +
        "nodeVersion: " + process.version +  "\n" +
        "rss: " + process.memoryUsage().rss +  "\n" +
        "pathEjecution: " + process.cwd() +  "\n" +
        "processId: " + process.pid +  "\n" +
        "folderProy: " + urlParams +  "\n" +
        "numCPUs: " + numCPUs);*/

        res.end("args: " + args._  +  "\n" +
                "io: " + process.platform +  "\n" +
                "nodeVersion: " + process.version +  "\n" +
                "rss: " + process.memoryUsage().rss +  "\n" +
                "pathEjecution: " + process.cwd() +  "\n" +
                "processId: " + process.pid +  "\n" +
                "folderProy: " + urlParams +  "\n" +
                "numCPUs: " + numCPUs
        );

        break;
    default:
        res.end("404");
        break;
  }

    });

    server.listen(port, () => {
        console.log(`Servidor escuchando en el puerto ${port}. PID: ${process.pid}`);
    });

}

