
const env = require('./environment');

const fs = require('fs');

const path = require('path');

//Will receive express app instance

module.exports = (app) => {

    //defining a function which will be in the global object

    app.locals.assetPath = function(filePath){

        if (env.name == 'development'){
            return filePath
        }

        //Need to change only when the environment is production

        return '/' + JSON.parse(fs.readFileSync(path.join(__dirname, '../public/assets/rev-manifest.json')))[filePath];
    }
}