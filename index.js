const express = require('express')
const app = express();
const router = require("./src/routes/index");
const bodyParser = require('body-parser');
const swaggerUi = require("swagger-ui-express")
const swaggerJson = require("./openApi.json");

require('dotenv').config();

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


router.use("/documentation", swaggerUi.serve, swaggerUi.setup(swaggerJson))
app.use(router);

router.use((err, req, res, next) => {
    console.log(err);
    res.status(500).json({
        status: 'fail',
        errors: err.message
    })
})

router.use((err, req, res, next) => {
    res.status(404).json({
        status: 'fail',
        errors: 'Are you lost?'
    })
})

app.listen(PORT, () => {
    console.log(`server jalan di http://localhost:${PORT}`);
})