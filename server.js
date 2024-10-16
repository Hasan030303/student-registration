const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');

dotenv.config();

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log('Connected to MongoDB');
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const studentRoutes = require('./routes/student');
app.use('/api', studentRoutes);

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});