/**
 * middleware state cpu and memory usage
 */
var logger = require('../util/log').getLogger('app');
var pidusage = require('pidusage');
var SDC = require('statsd-client');

const Mb = 1024*1024;
let stat = function(app,opts){
    app.sdc = new SDC(opts);
    setInterval(function () {
        pidusage(process.pid, function (err, stats) {
          //console.log(stats)
          // => {
          //   cpu: 10.0,            // percentage (from 0 to 100*vcore)
          //   memory: 357306368,    // bytes
          //   ppid: 312,            // PPID
          //   pid: 727,             // PID
          //   ctime: 867000,        // ms user + system time
          //   elapsed: 6650000,     // ms since the start of the process
          //   timestamp: 864000000  // ms since epoch
          // }
          app.sdc.gauge(app.name+'.cpu',stats.cpu);
          let mem = process.memoryUsage();
          app.sdc.gauge(app.name+'.rss',mem.rss/Mb);
          app.sdc.gauge(app.name+'.heapTotal',mem.heapTotal/Mb);
          app.sdc.gauge(app.name+'.heapUsed',mem.heapUsed/Mb);
        })
    }, 5*1000);
    // export stat interface here
    logger.debug("loading statsd here %j",opts);
    return async function(ctx,next){
        return await next();
    }
};
module.exports = stat;
