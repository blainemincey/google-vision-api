const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const cors = require('cors');
const PORT = 3001;

const app = express();

const multerMid = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
});

app.disable('x-powered-by')
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cors());
app.use(multerMid.single('file'))

require('./routes')(app);

app.listen(PORT, () => {
    console.log(`Routes running on port ${PORT}`)
});