import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";

export const assignUserPoints = async (userId: string, points: number, description:string, url:string, repositoryId:string) => {
    try {
        const pointsUpdated= await db.pointTransaction.create({
            data: {
                points,
                userId,
                description,
                url,
                repositoryId
            },
        });
        return pointsUpdated;

    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
        console.error("An error occurred while updating user points:", error.message);
        throw new Error("Database error occurred");
        }
        throw error;
    }
}