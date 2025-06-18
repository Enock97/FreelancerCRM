import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt'

const prisma = new PrismaClient();

async function main() { // For admin user

  const user = await prisma.user.create({
    data: {
      email: 'demo@user.com',
      password: await bcrypt.hash('test1234', 10),
    },
  });
 
  const contact1 = await prisma.contact.create({
    data: {
      name: 'Ola Nordmann',
      email: 'ola@nordmann.no',
      phone: '12345678',
      company: 'Ola IT',
      status: 'NEW',
      note: 'Fresh lead from website',
      userId: 1,
      activities: {
        create: [
          { description: 'Sent introduction mail' },
          { description: 'Followed up on phone' }
        ]
      }
    }
  });

  const contact2 = await prisma.contact.create({
    data: {
      name: 'Kari Nordmann',
      email: 'kari@nordmann.no',
      phone: '87654321',
      company: 'Kari Tekstil',
      status: 'FOLLOW_UP',
      note: 'Wants demo',
      userId: 1,
      activities: {
        create: [
          { description: 'Sent demo-invitation' },
          { description: 'Demo booked' }
        ]
      }
    }
  });

  const contact3 = await prisma.contact.create({
    data: {
      name: 'Per Hansen',
      email: 'per@hansen.no',
      phone: '11223344',
      company: 'Hansen AS',
      status: 'CUSTOMER',
      note: 'Signert kontrakt',
      userId: 1,
      activities: {
        create: [
          { description: 'Created user'},
          { description: 'Invoiced first month'}
        ]
      }
    }
  });

  const contact4 = await prisma.contact.create({
    data: {
      name: 'Anne Larsen',
      email: 'anne@larsen.no',
      phone: '44332211',
      company: 'Larsen Design',
      status: 'ARCHIVED',
      note: 'Chose contestant',
      userId: 1,
      activities: {
        create: [
          { description: 'Canceled dialog' },
          { description: 'Moved to archive' }
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
