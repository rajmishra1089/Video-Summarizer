const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const transcriptRoutes = require('./routes/transcriptRoutes');
const genRoutes = require('./routes/genRoutes');
const bodyParser = require('body-parser');

const app = express();

app.use(express.static('public'));


app.use(cors());
app.use(express.json());
app.use(morgan('common'));
app.use(bodyParser.urlencoded({ extended: true }));

require('dotenv').config();

app.use('/transcripts', transcriptRoutes);
app.use('/gen', genRoutes);

app.get('/', (req, res) => {
    // You don't need to send HTML here since it's served as a static file
    // You can send additional data or perform other logic if needed
    res.send('Hello from the root route!');
  });
  
app.listen(5000, () => {
    console.log('Server is running on port 5000');
}
);
