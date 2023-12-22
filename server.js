const express = require('express');
const app = express();
const port = 3000;

app.listen(port, () => {
    console.log('server is listening at localhost:${port}');
});

app.get('/path', (req, res) => {
    res.send('라우터 설정')
});