const faker = require('faker');
const prisma = require('../prismaClient');

async function seed() {
  console.log('Seeding database...');
  
  await prisma.comments.deleteMany();
  await prisma.reviews.deleteMany();
  await prisma.item.deleteMany();
  await prisma.user.deleteMany();

  const users = await Promise.all(
    [...Array(10)].map(() => 
    prisma.user,create({
      data: {
        username: faker.internet.userName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
      },
    }))
  )
  await Promise.all(
    items.map((item) => {
      [...Array(20)].map(() => {
        prisma.item.create({
          data: {
            name: faker.commerce.productName(),
            description: faker.commerce.productDescription(),
            price: faker.commerce.price(),
            reviews: faker.random.arrayElement(reviews),
            comments: faker.random.arrayElement(comments),
          }
        })
      })
    }
  ))
};
      

  main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  })
