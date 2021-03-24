const express = require('express');

const app = express();

const port = 800;

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

