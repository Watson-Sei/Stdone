import { PrismaClient } from ".prisma/client";
const prisma = new PrismaClient()

require('dotenv').config();

class UserService {
    // Donate User?
    static async donateUser(username: string) {
        const user = await prisma.user.findFirst({
            where: {
                username: username
            }
        })
        if (!user || (!user.address && !user.is_account)) {
            return null;
        }
        return {
            username: user?.username,
            address: user?.address
        }
    }
}

module.exports = UserService;