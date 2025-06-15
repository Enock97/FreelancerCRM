import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Sletter alt for en "clean slate"
  await prisma.activity.deleteMany();
  await prisma.contact.deleteMany();
  await prisma.user.deleteMany();

  // Lag bruker
  const user = await prisma.user.create({
    data: {
      email: 'demo@bruker.no',
      password: await bcrypt.hash('test1234', 10),
    },
  });

  // Lag kontakter
  const contacts = await prisma.contact.createMany({
    data: [
      {
        name: "Ola Nordmann",
        email: "ola@nordmann.no",
        phone: "90012345",
        company: "Nordic AS",
        status: "NY",
        note: "Første kontakt",
        userId: user.id,
      },
      {
        name: "Kari Nordmann",
        email: "kari@nordmann.no",
        phone: "91122334",
        company: "Kari Tekstil",
        status: "OPPFOLGING",
        note: "Interessert i demo",
        userId: user.id,
      },
      {
        name: "Ali Ahmed",
        email: "ali@ahmed.no",
        phone: "98811223",
        company: "Ahmed Transport",
        status: "KUNDE",
        note: "God kunde",
        userId: user.id,
      },
      {
        name: "Sara Olsen",
        email: "sara@olsen.no",
        phone: "97998877",
        company: "Olsen IT",
        status: "ARKIVERT",
        note: "Ingen respons",
        userId: user.id,
      },
    ],
  });

  // Hent kontakter for å få id'ene
  const kontaktListe = await prisma.contact.findMany({ where: { userId: user.id } });

  // Lag activities for hver kontakt (to aktiviteter per kontakt)
  for (const contact of kontaktListe) {
    await prisma.activity.createMany({
      data: [
        { description: "Første aktivitet for " + contact.name, contactId: contact.id },
        { description: "Andre aktivitet for " + contact.name, contactId: contact.id },
      ],
    });
  }

  console.log("Dummydata ferdig satt inn!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
