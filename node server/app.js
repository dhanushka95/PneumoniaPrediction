const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(express.static('uploads'));

// Admin API
app.use('/api', require('./router'));
require('./controller').getWeightForModel();
app.listen(PORT, console.log(`Server started on port ${PORT}`));


