const express = require('express');
const bodyParser = require('body-parser');
const parameterRoutes = require('../../interfaces/routes/parameterRoutes');
const errorHandling = require('../../utils/errorHandling');
const cors = require('cors');
require('dotenv').config();


const app = express();

app.use(bodyParser.json());

app.use(cors());

app.use('/api',parameterRoutes)

app.use(errorHandling);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
