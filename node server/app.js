const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 5001;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(express.static('uploads'));

// Admin API
app.use('/api', require('./router'));
app.listen(PORT, console.log(`Server started on port ${PORT}`));

