const express = require('express');

const app = express();

const port = 800;

const expressLayouts = require('express-ejs-layouts');

//In which folder should the app lookout for Static files

app.use(express.static('./assets'));

app.use(expressLayouts);

//Extract style and scripts from sub pages into the layout

app.set('layout extractStyles',true);
app.set('layout extractScripts',true);



//Use express router

app.use('/', require('./routes/index'));

//Set Up The View Engine
app.set('view engine', 'ejs');
app.set('views', './views');



app.listen(port, function(err){

    if (err)
    {
        console.log(`Error in running the server: ${err}`);
    }

    console.log(`Server is running on port: ${port}`);
    
});

