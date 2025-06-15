import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt'

const prisma = new PrismaClient();

async function main() {
  // Bruker med id 2 må eksistere fra før
    // Lag bruker
  const user = await prisma.user.create({
    data: {
      email: 'demo@bruker.no',
      password: await bcrypt.hash('test1234', 10),
    },
  });

  // Kontakt 1
  const kontakt1 = await prisma.contact.create({
    data: {
      name: 'Ola Nordmann',
      email: 'ola@nordmann.no',
      phone: '12345678',
      company: 'Ola IT',
      status: 'NY',
      note: 'Fersk lead fra nettside',
      userId: 1,
      activities: {
        create: [
          { description: 'Sendte introduksjonsmail' },
          { description: 'Fulgte opp på telefon' }
        ]
      }
    }
  });

  // Kontakt 2
  const kontakt2 = await prisma.contact.create({
    data: {
      name: 'Kari Nordmann',
      email: 'kari@nordmann.no',
      phone: '87654321',
      company: 'Kari Tekstil',
      status: 'OPPFOLGING',
      note: 'Vil ha demo',
      userId: 1,
      activities: {
        create: [
          { description: 'Sendte demo-invitasjon' },
          { description: 'Demo booket' }
        ]
      }
    }
  });

  // Kontakt 3
  const kontakt3 = await prisma.contact.create({
    data: {
      name: 'Per Hansen',
      email: 'per@hansen.no',
      phone: '11223344',
      company: 'Hansen AS',
      status: 'KUNDE',
      note: 'Signert kontrakt',
      userId: 1,
      activities: {
        create: [
          { description: 'Opprettet bruker'},
          { description: 'Fakturert første måned'}
        ]
      }
    }
  });

  // Kontakt 4
  const kontakt4 = await prisma.contact.create({
    data: {
      name: 'Anne Larsen',
      email: 'anne@larsen.no',
      phone: '44332211',
      company: 'Larsen Design',
      status: 'ARKIVERT',
      note: 'Valgte konkurrent',
      userId: 1,
      activities: {
        create: [
          { description: 'Avsluttet dialog' },
          { description: 'Flyttet til arkiv' }
        ]
      }
    }
  });

  console.log('Seed complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
