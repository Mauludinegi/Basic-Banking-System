const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const prisma = new PrismaClient();

const cryptPassword = async (password) => {
    const salt = await bcrypt.genSalt(5);
    return bcrypt.hash(password, salt);
}

module.exports = {
    registerUser: async (req, res) => {
        // menambahkan data kedalam table user dan profiles
        try {
            const { name, email, password, identity_number, identity_type, address } = req.body;
            const user = await prisma.users.create({
                data: {
                    name: name,
                    email: email,
                    password: await cryptPassword(password),
                    profile: {
                        create: {
                            identity_number: identity_number,
                            identity_type: identity_type,
                            address: address,
                        }
                    }
                },
                include: {
                    profile: true,
                }
            });

            return res.status(201).json({
                message: 'User registered succesfully',
                data: {
                    ...user,
                    profile: {
                        identity_type: identity_type,
                        identity_number: identity_number,
                        address: address,
                    }
                }
            })
        } catch (error) {
            return res.status(500).json({
                message: "Internal server error"
            })
        }
    },


    loginUser: async (req, res) => {
        const findUser = await prisma.users.findFirst({
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
            const token = jwt.sign({ id: findUser.id }, 'secret_key', {
                expiresIn: '6h'
            })

            return res.status(200).json({
                data: { token }
            })
        }
        return res.status(403).json({
            error: "Invalid Credentials"
        })
    },


    getProfile: async (req, res) => {
        const user = await prisma.users.findUnique({
            where: {
                id: res.user.id
            }
        })

        return res.status(200).json({
            data: user
        })
    },


    getAllUser: async (req, res) => {
        // mendapatkan semua data user
        try {
            const users = await prisma.users.findMany();
            if (!users || users.length === 0) {
                return res.status(404).json({ error: "Users not found" });
            }

            return res.status(200).json({
                message: "Success get all user",
                data: users
            })
        } catch (error) {
            return res.status(500).json({
                message: "Internal server error"
            })
        }
    },

    getUserById: async (req, res) => {
        // mendapatkan data user sesuai dengan id dan juga mendapatkan data profile yang sesuai dengan user
        try {
            const userId = req.params.userId;
            const user = await prisma.users.findUnique({
                where: {
                    id: Number(userId)
                },

                include: {
                    profile: true,
                }
            });

            if (!user) {
                return res.status(404).json({ error: "User not found" });
            }
            return res.status(200).json({
                message: "Success get user by id",
                data: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    profile: {
                        identity_type: user.profile?.identity_type || null,
                        identity_number: user.profile?.identity_number || null,
                        address: user.profile?.address || null,
                    }
                }
            })
        } catch (error) {
            return res.status(500).json({
                message: "Internal server error"
            })
        }

    },

    updateUserByid: async (req, res) => {
        // mengubah data user dan profile yang terkait
        try {
            const userId = req.params.userId;
            const { name, email, password, identity_number, identity_type, address } = req.body;
            const encrypt = await bcrypt.genSalt();
            const hashPassword = await bcrypt.hash(password, encrypt);

            const updatedUser = await prisma.users.update({
                where: { id: Number(userId) },
                data: {
                    name,
                    email,
                    password: hashPassword,
                },
            });

            const updatedProfile = await prisma.profiles.upsert({
                where: { user_id: Number(userId) },
                create: {
                    identity_number,
                    identity_type,
                    address,
                    user: { connect: { id: updatedUser.id } },
                },
                update: {
                    identity_number,
                    identity_type,
                    address,
                },
            });

            return res.status(200).json({
                message: "User and profile updated successfully",
                data: updatedUser, updatedProfile
            });
        } catch (error) {
            return res.status(500).json({
                message: "Internal server error"
            })
        }
    },

    deleteUserById: async (req, res) => {
        // menghapus semua data yang terkait dengan user_id
        try {
            const userId = req.params.userId;
            await prisma.bank_account_transactions.deleteMany({
                where: {
                    OR: [
                        { source_account: { user_id: Number(userId) } },
                        { destination_account: { user_id: Number(userId) } },
                    ],
                },
            });

            await prisma.profiles.deleteMany({
                where: { user_id: Number(userId) },
            });

            await prisma.bank_accounts.deleteMany({
                where: { user_id: Number(userId) },
            });

            await prisma.users.delete({
                where: { id: Number(userId) },
            });

            return res.status(200).json({ message: "User and related data deleted successfully" });
        } catch (error) {
            return res.status(500).json({ error: "Internal server error" });
        }
    }

}