const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

module.exports = {
    createTransactions: async (req, res) => {
        try {
            const { source_account_id, destination_account_id, amount } = req.body;

            const sourceAccount = await prisma.bank_accounts.findUnique({
                where: { id: Number(source_account_id) },
            });

            if (!sourceAccount) {
                return res.status(404).json({ error: "Source account not found" });
            }

            const destinationAccount = await prisma.bank_accounts.findUnique({
                where: { id: Number(destination_account_id) },
            });

            if (!destinationAccount) {
                return res.status(404).json({ error: "Destination account not found" });
            }

            if (Number(sourceAccount.balance) < amount) {
                return res.status(400).json({ error: "Insufficient funds in the source account" });
            }

            await prisma.$transaction([
                prisma.bank_accounts.update({
                    where: { id: source_account_id },
                    data: { balance: { decrement: Number(amount) } },
                }),
                prisma.bank_accounts.update({
                    where: { id: destination_account_id },
                    data: { balance: { increment: Number(amount) } },
                }),
                prisma.bank_account_transactions.create({
                    data: {
                        source_account_id,
                        destination_account_id,
                        amount,
                    },
                }),
            ]);

            return res.status(200).json({
                message: "Transaction successful",
                data: {
                    source_account_id: source_account_id,
                    destination_account_id: destination_account_id,
                    amount: Number(amount)
                }
            })
        } catch (error) {
            return res.status(500).json({ error: "Internal Server Error" })
        }
    },

    getAllTransactions: async (req, res) => {
        try {
            const transaction = await prisma.bank_account_transactions.findMany();
            if (!transaction || transaction.length === 0) {
                return res.status(404).json({ message: "Transaction not found" });
            }

            const transactionData = transaction.map(transaction => ({
                id: Number(transaction.id),
                source_account_id: Number(transaction.source_account_id),
                destination_account_id: Number(transaction.destination_account_id),
                amount: Number(transaction.amount),

            }))

            return res.status(200).json({
                message: "Get all transactions successfully",
                data: transactionData
            })
        } catch (err) {
            return res.status(500).json({ error: "Internal Server Error" })
        }
    },


    getTransactionsById: async (req, res) => {
        try {
            const transactionId = req.params.transactionId;
            const transaction = await prisma.bank_account_transactions.findUnique({
                where: {
                    id: Number(transactionId)
                },
                include: {
                    source_account: {
                        include: {
                            user: true,
                        },
                    },
                    destination_account: {
                        include: {
                            user: true,
                        },
                    },
                }
            });

            if (!transaction) {
                return res.status(404).json({ error: "Transaction not found" });
            }

            const response = {
                id: Number(transaction.id),
                amount: Number(transaction.amount),
                source_account: {
                    id: Number(transaction.source_account.id),
                    bank_name: transaction.source_account.bank_name,
                    bank_account_number: Number(transaction.source_account.bank_account_number),
                    balance: Number(transaction.source_account.balance),
                    user: {
                        id: Number(transaction.source_account.user.id),
                        name: transaction.source_account.user.name,
                        email: transaction.source_account.user.email,
                    },
                },
                destination_account: {
                    id: Number(transaction.destination_account.id),
                    bank_name: transaction.destination_account.bank_name,
                    bank_account_number: Number(transaction.destination_account.bank_account_number),
                    balance: Number(transaction.destination_account.balance),
                    user: {
                        id: Number(transaction.destination_account.user.id),
                        name: transaction.destination_account.user.name,
                        email: transaction.destination_account.user.email,
                    },
                },
            };

            return res.status(200).json({
                message: "Success get transactions by id",
                data: response
            })
        } catch (err) {
            return res.status(500).json({ error: "Internal Server Error" })
        }
    },

    deleteTransactionsById: async (req, res) => {
        try {
            const transactionId = req.params.transactionId;
            const existTransaction = await prisma.bank_account_transactions.findUnique({
                where: {id: Number(transactionId)}
            })

            if (!existTransaction) {
                return res.status(404).json({ error: "Transaction not found" });
            }

            const transaction = await prisma.bank_account_transactions.delete({
                where: {
                    id: Number(transactionId)
                }
            })

            return res.status(200).json({
                message: "Transaction deleted successfully"
            })
        } catch (error) {
            return res.status(500).json({ error: "Internal Server Error" })
        }
    }

}