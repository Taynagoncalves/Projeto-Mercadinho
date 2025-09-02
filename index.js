const express = require('express');
const app = express();
const path = require('path');


app.use(express.static(path.join(__dirname,
'src')));

app.get('/'
, (req, res) => {
res.sendFile(path.join(__dirname,
'src'
,
'index.html'));
});

app.listen(8081, () => {
console.log('Servidor iniciado na porta 8080: http://localhost:8081');
});
