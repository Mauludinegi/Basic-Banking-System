const { PrismaClient } = require('@prisma/client'),
    prisma = new PrismaClient();


module.exports = {
    users: prisma.users,
    profiles: prisma.profiles,
    bank_account: prisma.bank_accounts,
    bank_account_transactions: prisma.bank_account_transactions
}