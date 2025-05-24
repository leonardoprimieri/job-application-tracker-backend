import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../src/auth/utils/hashPassword";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await hashPassword("qwe123QWE!@#");

  await prisma.user.upsert({
    where: { email: "jon@snow.com" },
    update: {},
    create: {
      lastName: "Snow",
      firstName: "Jon",
      email: "jon@snow.com",
      passwordHash,
      avatarUrl:
        "https://i.pinimg.com/736x/79/16/44/7916447bbce8c6e19205f47235331097.jpg",
      jobApplications: {
        createMany: {
          data: [
            {
              companyName: "The Night's Watch",
              title: "Lord Commander",
              appliedDate: new Date(),
              status: "APPLIED",
              notes: "Defender of the Wall",
              url: "https://www.nightswatch.com",
            },
            {
              companyName: "Winterfell",
              title: "Stark",
              appliedDate: new Date(),
              status: "OFFER",
              notes: "House Stark of Winterfell",
              url: "https://www.winterfell.com",
            },
            {
              companyName: "The Wall",
              title: "Builder",
              appliedDate: new Date(),
              status: "REJECTED",
              notes: "Building the Wall",
              url: "https://www.wall.com",
            },
            {
              companyName: "The Seven Kingdoms",
              title: "King in the North",
              appliedDate: new Date(),
              status: "ACCEPTED",
              notes: "Ruler of the North",
              url: "https://www.sevenkingdoms.com",
            },
            {
              companyName: "Dragonstone",
              title: "Targaryen",
              appliedDate: new Date(),
              status: "SAVED",
              notes: "House Targaryen of Dragonstone",
              url: "https://www.dragonstone.com",
            },
            {
              companyName: "King's Landing",
              title: "Hand of the King",
              appliedDate: new Date(),
              status: "DECLINED",
              notes: "Advisor to the King",
              url: "https://www.kingslanding.com",
            },
            {
              companyName: "The Citadel",
              title: "Maester",
              appliedDate: new Date(),
              status: "INTERVIEW",
              notes: "Training to become a Maester",
              url: "https://www.citadel.com",
            },
          ],
        },
      },
    },
  });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
