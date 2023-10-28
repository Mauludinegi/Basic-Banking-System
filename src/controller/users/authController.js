const { users } = require('../../models'),
    utils = require('../../utils/encryptPass'),
    jwt = require('jsonwebtoken'),
    bcrypt = require('bcrypt')
require('dotenv').config()
const secret_key = process.env.JWT_KEY || 'no_secret'

module.exports = {
    register: async (req, res) => {
        try {
            const data = await users.create({
                data: {
                    name: req.body.name,
                    email: req.body.email,
                    password: await utils.cryptPassword(req.body.password),
                    profile: {
                        create: {
                            identity_number: req.body.identity_number,
                            identity_type: req.body.identity_type,
                            address: req.body.address,
                        }
                    }
                },
                include: {
                    profile: true,
                }
            })

            return res.status(201).json({
                data
            });

        } catch (err) {
            return res.status(400).json({
                err
            })
        }
    },

    login: async (req, res) => {
        try {
            const findUser = await users.findFirst({
                where: {
                    email: req.body.email
                }
            })

            if (!findUser) {
                return res.status(404).json({
                    error: "Users Not Found"
                })
            }

            if (bcrypt.compareSync(req.body.password, findUser.password)) {
                const token = jwt.sign({ id: findUser.id, email: findUser.email }, secret_key, { expiresIn: '6h' })

                return res.status(200).json({
                    data: {
                        token
                    }
                })
            }

            return res.status(403).json({
                error: 'Invalid credentianls'
            })

        } catch (error) {
            return res.status(500).json({
                error
            })
        }
    },

    profile: async (req, res) => {
        try {
            const user = await users.findUnique({
                include: {
                    profile: true
                },
                where: {
                    id: res.user.id
                }
            })

            return res.status(200).json({
                data: user
            })
        } catch (error) {
            return res.status(500).json({
                error
            });
        }
    },
}