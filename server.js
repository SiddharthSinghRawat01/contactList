const express = require('express');
require('dotenv').config();
const port = process.env.PORT || 8080;

const app = express();

app.use(express.json());
app.use('/',require('./router/route'))

app.listen(port, (err) => {
    if (err) console.log(err);
    console.log(`server is listing at port ${port}.`);
});