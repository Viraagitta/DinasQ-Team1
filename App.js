require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const PORT = process.env.PORT || 3000;
const routes = require("./routes");
const errorHandler = require("./middlewares/ErrorHandler");

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(routes);
app.use(errorHandler);

if(process.env.NODE_ENV !== 'test'){
app.listen(PORT, () => console.log(`Successfully connected to port ${PORT}`));
}

module.exports = app