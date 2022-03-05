import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import { v4 as uuidv4 } from 'uuid';

export const findPublicAddress = async (publicAddress: string) => {
    const user = await prisma.user.findUnique({
        where: {
            publicAddress: publicAddress,
        }
    })
    return user;
}

export const findUsername = async (username: string) => {
    const user = await prisma.user.findUnique({
        where: {
            username: username
        }
    })
    return user;
}

export const create = async (publicAddress: string) => {
    try {
        const user = await prisma.user.findUnique({
            where: {
                publicAddress: publicAddress,
            }
        });
        if (user === null) {
            return await prisma.user.create({
                data: {
                    // randoma nonce
                    nonce: Math.floor(Math.random() * 1000000),
                    // register ethereum address
                    publicAddress: publicAddress,
                    // first random user identification name
                    username: uuidv4(),
                }
            });
        }
        return user;
    } catch (error: any) {
        return null;
    }
}

export const updateNonce = async (publicAddress: string) => {
    try {
        const user = await prisma.user.update({
            where: {
                publicAddress: publicAddress,
            },
            data: {
                nonce: Math.floor(Math.random() * 1000000),
            }
        })
        return user;
    } catch (error: any) {
        return null;
    }
}

export const updaetIsContract = async (publicAddress: string) => {
    try {
        await prisma.user.update({
            where: {
                publicAddress: publicAddress,
            },
            data: {
                isContract: true
            }
        })
    } catch (error: any) {
        return null;
    }
}