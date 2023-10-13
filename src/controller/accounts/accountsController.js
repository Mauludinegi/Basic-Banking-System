const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

module.exports = {
    createAccount: async (req, res) => {
        try {
            const { bank_name, bank_account_number, balance, user_id } = req.body;
            const existingUser = await prisma.users.findUnique({
                where: {
                    id: Number(user_id)
                }
            })

            if (!existingUser) {
                return res.status(404).json({
                    error: true,
                    message: "User Not Found"
                })
            }

            const account = await prisma.bank_accounts.create({
                data: {
                    bank_name: bank_name,
                    bank_account_number: Number(bank_account_number),
                    balance: Number(balance),
                    user: {
                        connect: { id: Number(user_id) }
                    }
                }
            });

            return res.status(201).json({
                message: "Create Account Successfully",
                data: {
                    ...account,
                    bank_account_number: Number(bank_account_number),
                    balance: Number(balance)
                }
            })
        } catch (error) {
            return res.status(500).json({ error: "Internal server error" });
        }
    },

    getAllAccounts: async (req, res) => {
        try {
            const account = await prisma.bank_accounts.findMany();

            if (!account || account.length === 0) {
                return res.status(404).json({ error: "Account not found" });
            }

            const accountData = account.map(account => ({
                ...account,
                bank_account_number: Number(account.bank_account_number),
                balance: Number(account.balance)
            }));

            return res.status(200).json({
                message: "Success get all accounts",
                data: accountData
            })
        } catch (error) {
            return res.status(500).json({ error: "Internal server error" });
        }
    },


    getAccountById: async (req, res) => {
        try {
            const accountId = req.params.accountId;
            const account = await prisma.bank_accounts.findUnique({
                where: {
                    id: Number(accountId)
                }
            })

            if (!account) {
                return res.status(404).json({ error: "Account Not Found" })
            }

            return res.status(200).json({
                message: 'Success get account by id',
                data: {
                    ...account,
                    bank_account_number: Number(account.bank_account_number),
                    balance: Number(account.balance)
                }
            })
        } catch (error) {
            return res.status(500).json({ error: "Internal server error" });
        }
    },

    updateAccountById: async (req, res) => {
        try {
            const accountId = req.params.accountId;
            const { bank_name, bank_account_number, balance } = req.body;
            const existingAccount = await prisma.bank_accounts.findUnique({
                where: { id: Number(accountId) }
            })

            if (!existingAccount) {
                return res.status(404).json({ message: "Account Not Found" })
            }

            const account = await prisma.bank_accounts.update({
                where: {
                    id: Number(accountId)
                },
                data: {
                    bank_name,
                    bank_account_number: Number(bank_account_number),
                    balance: Number(balance)
                }
            })

            return res.status(200).json({
                message: "Account Updated Successfully",
                data: {
                    ...account,
                    bank_account_number: Number(account.bank_account_number),
                    balance: Number(account.balance)
                }
            })
        } catch (error) {
            return res.status(500).json({ error: "Internal server error" });
        }
    },

    deleteAccountById: async (req, res) => {
        try {
            const accountId = req.params.accountId;
            const existingAccount = await prisma.bank_accounts.findUnique({
                where: { id: Number(accountId) }
            })

            if (!existingAccount) {
                return res.status(404).json({ message: "Account Not Found" })
            }
            await prisma.bank_account_transactions.deleteMany({
                where: {
                    OR: [
                        { source_account_id: Number(accountId) },
                        { destination_account_id: Number(accountId) }
                    ]
                }
            })

            await prisma.bank_accounts.delete({
                where: { id: Number(accountId) }
            })

            return res.status(200).json({
                message: "Account and associated transactions were successfully deleted"
            })
        } catch (error) {
            return res.status(500).json({ error: "Internal server error" });
        }
    }
}