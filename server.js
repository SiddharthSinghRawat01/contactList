const express = require('express');
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 8080;

const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.use(express.json());
app.use('/', require('./router/route'));

app.get('/progressbar', async (req, res) => {
    return res.sendFile(__dirname + '/view/index.html')
})

io.on('connection', async  (socket) => {
    console.log('Client connected');

    try {
        
        const response = await fetch('https://imgv3.fotor.com/images/blog-cover-image/part-blurry-image.jpg');
        const contentLength = response.headers.get('content-length');
        let loaded = 0;
        let completion = 0;

        const customResponse = new Response(
            new ReadableStream({
                start(controller) {
                    const reader = response.body.getReader();
                    
                    read(reader,controller,loaded,contentLength);
                },
            })
        );

        await customResponse.blob();
        console.log('Complete');

        
    } catch (err) {
        console.log(err);
        res.status(500).send({ error: 'An error occurred' });
    }
    socket.on('disconnect', () => {
        console.log('User disconnected');
      });
      
});

function read(reader,controller,loaded,contentLength) {
    reader.read().then(({ done, value }) => {
        if (done) {
            controller.close();
            return;
        }

        loaded += value.byteLength;
        completion = Math.round((loaded / contentLength) * 100);

        let lastEmittedCompletion = -1;

            console.log(completion);
            if (completion > lastEmittedCompletion + 5) { // Emit every 5% change
                io.emit('data', { msg: completion });
                lastEmittedCompletion = completion;
            }
        

        // Inside the read() function


        controller.enqueue(value);
        read(reader,controller,loaded,contentLength);
    });
}



    


http.listen(port, (err) => {
    if (err) console.log(err);
    console.log(`Server is listening at port ${port}.`);
});
