/**
 * middleware for Nunjucks template engine
 */
const nunjucks = require('nunjucks');

function createEnv(path, opts) {
    var
        autoescape = opts.autoescape === undefined ? true : opts.autoescape,
        noCache = opts.noCache || false,
        watch = opts.watch || false,
        throwOnUndefined = opts.throwOnUndefined || false,
        env = new nunjucks.Environment(
            new nunjucks.FileSystemLoader(path, {
                noCache: noCache,
                watch: watch,
            }), {
                autoescape: autoescape,
                throwOnUndefined: throwOnUndefined
            });
    if (opts.filters) {
        for (var f in opts.filters) {
            env.addFilter(f, opts.filters[f]);
        }
    }
    return env;
}



// define the nunjunk middle ware
let mw = function(app,path,opts){
    let env = createEnv(path,opts); 
    app.context.render = function(view, model){
        this.response.body = env.render(view, Object.assign({}, this.state || {}, model || {}))
        this.response.type = 'text/html'
    };
    app.context.renderString = function(string,data){
        return nunjucks.renderString(string,data);
    }
    return async (ctx, next) => {
        await next();
    }
}
module.exports = mw;