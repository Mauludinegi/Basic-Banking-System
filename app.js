const express = require('express')
const app = express();
const router = require("./src/routes/index");
const bodyParser = require('body-parser');
const swaggerUi = require("swagger-ui-express")
const swaggerJson = require("./openApi.json");

require('dotenv').config();

const PORT = process.env.PORT || 3000;
const PORT_TEST = process.env.PORT_TEST || 3000;

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


router.use("/documentation", swaggerUi.serve, swaggerUi.setup(swaggerJson))
app.use(router);

app.get('*', (req, res) => {
    return res.status(404).json({
        error: 'End point is not registered'
    })
})


app.listen(PORT, () => {
    console.log(`server jalan di http://localhost:${PORT}`);
})


module.exports = app;