const { PrismaClient } = require('@prisma/client');
const faker = require('faker');
const prisma = new PrismaClient();

async function seedUsers(numberOfUsers) {
  const users = [];
  for(let i = 0; i< numberOfUsers; i++) {
    const user = await prisma.user.create ({
      data: {
        name: faker.name.findName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
      },
    });
    users.push(user);
  }
  return users;
}

async function seedItems(users) {
  const items = [];
  for(const user of users) {
    const item = await prisma.item.create ({
      data: {
        name: faker.commerce.productName(),
        userId: user.id,
      },
    });
    items.push(item);
  }
  return items;
}

async function seedReviews(users, items) {
  const reviews = [];
  for(const item of items) {
    for(const user of users) {
      const review = await prisma.review.create({
        data: {
          title: "Review Title",
          text: faker.lorem.sentence(),
          rating: faker.datatype.number({min: 1, max: 5}),
          userId: user.id,
          itemId: item.id,
        },
      });
      reviews.push(review);
    }
  }
  return reviews;
}

async function seedComments(users, reviews) {
  const comments = [];
  for(const review of reviews) { 
      for(const user of users) {
        const comment = await prisma.comment.create({
          data: {
            text: faker.lorem.sentence(),
            userId: user.id,
            reviewId: review.id,
            itemId: review.itemId,
          },
      });
        comments.push(comment);
    }
  }
  return comments;
}

async function main() {
  console.log('Starting to seed database...');
  
  await prisma.$transaction([
    prisma.comment.deleteMany(),
    prisma.review.deleteMany(),
    prisma.item.deleteMany(),
    prisma.user.deleteMany(),
  ]);

  const numberOfUsers = 20;
  const users = await seedUsers(numberOfUsers);
  console.log(`${users.length} users created`);

  const items = await seedItems(users);
  console.log(`${items.length} items created.`);

  const reviews = await seedReviews(users, items);
  console.log(`${reviews.length} reviews created.`);

  const comments = await seedComments(users, reviews);
  console.log(`${comments.length} comments created.`);

  console.log('Database seeded sucessfully');
  
};
      

  main()
  .catch((e) => {
    console.error('Error seeding DB', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  })
