import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const passwordHash = await bcrypt.hash('demo123', 10)

  const admin = await prisma.user.upsert({
    where: { email: 'admin@finflow.com' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@finflow.com',
      passwordHash,
      trustScore: 999,
      totalBalance: 100000.0,
      investmentPortfolio: {
        create: {
          totalInvested: 50000.0,
          currentEstimatedValue: 65000.0,
        }
      }
    },
  })

  const user = await prisma.user.upsert({
    where: { email: 'user@finflow.com' },
    update: {},
    create: {
      name: 'Demo User',
      email: 'user@finflow.com',
      passwordHash,
      trustScore: 85,
      totalBalance: 2500.0,
      investmentPortfolio: {
        create: {
          totalInvested: 1000.0,
          currentEstimatedValue: 1200.0,
        }
      }
    },
  })

  console.log("Seeding successful!")
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
