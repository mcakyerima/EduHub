// this file is used to prepoppulate the database with the categories listed
// because if we dont populate the categories column, the user will not be able
// see a list in the drop down menu.
// run this file with the command node filename

const { PrismaClient } = require("@prisma/client");

const database = new PrismaClient();

async function main() {
    try {
        await database.category.createMany({
            data: [
                { name: "Computer Schience" },
                { name: "Music" },
                { name: "Fitness" },
                { name: "Photography" },
                { name: "Accounting" },
                { name: "Engineering" },
                { name: "Filming" },
                { name: "Artificial Intelligence" },
            ]
        });

        console.log("Success");
    } catch (error) {
        console.log("Error seedint the database categories", error)
    } finally {
        await database.$disconnect();
    }
}

main();