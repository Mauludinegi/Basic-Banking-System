const base = require('../controller/baseController')
const mockRequest = (body = {}) => ({ body })
const mockResponse = () => {
    const res = {}
    res.json = jest.fn().mockReturnValue(res)
    res.status = jest.fn().mockReturnValue(res)
    return res
}

describe('base.index function', () => {
    test(`res.json called with {status: true, message: "Hello World"}`, done => {
        const req = mockRequest()
        const res = mockResponse()
        base.index(req, res)
        expect(res.status).toBeCalledWith(200)
        expect(res.json).toBeCalledWith({
            status: true,
            message: "Hello World!"
        })
        done()
    })
})

describe('base.sum function', () => {
    test('res.json called with {...basicResponse, data: {x: x, y:y, result: x + y } }', done => {


        const req = mockRequest({ x: 5, y: 10 })
        const res = mockResponse()
        const expectedResult = req.body.x + req.body.y
        base.sum(req, res)
        expect(res.status).toBeCalledWith(200)
        expect(res.json).toBeCalledWith({
            status: true,
            message: "Parameters summarized!",
            data: { x: req.body.x, y: req.body.y, result: req.body.x + req.body.y }
        })
        done()
    })
})