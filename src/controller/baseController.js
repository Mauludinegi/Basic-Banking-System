module.exports = {
    index: (req, res) => {
        res.status(200).json({
            status: true,
            message: "Hello World!"
        })
    },
    sum: (req, res) => {
        res.status(200).json({
            status: true,
            message: "Parameters summarized!",
            data: { x: req.body.x, y: req.body.y, result: req.body.x + req.body.y }
        })
    }
}

    