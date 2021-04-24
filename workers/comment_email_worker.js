const queue = require('../config/kue');

const commentsMailer = require('../mailers/comments_mailer');

//Whenever a new task is added in your queue, you need to run the code inside the process function
//Every worker has a 'process' function

//job is what it needs to do -> function that needs to get executed inside of this, and data(comment)
queue.process('emails', function(job, done){

    console.log('emails worker is processing a job', job.data);

    //Process function calls the mailer

    commentsMailer.newComment(job.data);

    done();
});