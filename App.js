const express = require("express");
const app = express();
const cors = require("cors");
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get("/", (req, res) => res.send("Udah connect"));

if(process.env.NODE_ENV !== 'test'){
app.listen(PORT, () => console.log(`Successfully connected to port ${PORT}`));
}