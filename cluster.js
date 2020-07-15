const cluster = require("cluster");
const numCPUs = require("os").cpus().length;
if (process.env.Node_ENV === "development") {
  require("./server");
} else {
  if (cluster.isMaster) {
    console.log(`Master ${process.pid} is running`);
    // Fork workers.
    for (let i = 0; i < numCPUs; i++) {
      cluster.fork();
    }
    cluster.on("exit", (worker, code, signal) => {
      console.log(`worker ${worker.process.pid} died`);
    });
  } else {
    console.log(`Worker ${process.pid} started`);
    require("./server");
  }
}
