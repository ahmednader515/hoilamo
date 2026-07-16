import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import {
  DEFAULT_SITE_CONTENT,
  allContentKeys,
} from "../lib/site-content";

const prisma = new PrismaClient();

const ADMIN_EMAIL = "admin@gmail.com";
const ADMIN_PASSWORD = "123";

const FRONT_IMAGE = "/front.png";
const SIDE_IMAGE = "/side.png";

async function main() {
  const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 12);

  await prisma.user.upsert({
    where: { email: ADMIN_EMAIL },
    update: {
      name: "المسؤول",
      password: hashedPassword,
      role: "ADMIN",
    },
    create: {
      email: ADMIN_EMAIL,
      name: "المسؤول",
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  await prisma.user.deleteMany({
    where: {
      email: { in: ["admin@coffeeshop.com"] },
      NOT: { email: ADMIN_EMAIL },
    },
  });

  const categories = [
    { name: "إسبريسو", slug: "espresso" },
    { name: "قهوة مخمّرة", slug: "brewed-coffee" },
    { name: "شاي وبدائل", slug: "tea-alternatives" },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name },
      create: cat,
    });
  }

  const espresso = await prisma.category.findUniqueOrThrow({
    where: { slug: "espresso" },
  });
  const brewed = await prisma.category.findUniqueOrThrow({
    where: { slug: "brewed-coffee" },
  });
  const tea = await prisma.category.findUniqueOrThrow({
    where: { slug: "tea-alternatives" },
  });

  const products = [
    {
      name: "إسبريسو",
      slug: "espresso",
      description: "شوكولاتة داكنة، كراميل، لوز محمّص",
      price: 2.5,
      categoryId: espresso.id,
      stock: 100,
    },
    {
      name: "كابتشينو",
      slug: "cappuccino",
      description: "إسبريسو، حليب مبخّر، رغوة ناعمة",
      price: 4.25,
      categoryId: espresso.id,
      stock: 80,
    },
    {
      name: "لاتيه",
      slug: "latte",
      description: "إسبريسو ناعم، حليب مخملي، حلاوة خفيفة",
      price: 4.5,
      categoryId: espresso.id,
      stock: 80,
    },
    {
      name: "أمريكانو",
      slug: "americano",
      description: "إسبريسو نظيف، نهاية مشرقة، قوام خفيف",
      price: 3.5,
      categoryId: espresso.id,
      stock: 90,
    },
    {
      name: "صبّ يدوي",
      slug: "pour-over",
      description: "حمضيات، أزهار، حلاوة عسل",
      price: 4.0,
      categoryId: brewed.id,
      stock: 50,
    },
    {
      name: "كولد برو",
      slug: "cold-brew",
      description: "كاكاو، سكر بني، نهاية ناعمة",
      price: 4.75,
      categoryId: brewed.id,
      stock: 40,
    },
    {
      name: "لاتيه ماتشا",
      slug: "matcha-latte",
      description: "ماتشا احتفالية، كريمية، أومامي",
      price: 5.0,
      categoryId: tea.id,
      stock: 45,
    },
    {
      name: "لاتيه شاي",
      slug: "chai-latte",
      description: "هيل، قرفة، قرنفل، شاي أسود",
      price: 4.5,
      categoryId: tea.id,
      stock: 45,
    },
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {
        name: product.name,
        description: product.description,
        price: product.price,
        imageUrl: FRONT_IMAGE,
        hoverImageUrl: SIDE_IMAGE,
        categoryId: product.categoryId,
        stock: product.stock,
        active: true,
      },
      create: {
        ...product,
        imageUrl: FRONT_IMAGE,
        hoverImageUrl: SIDE_IMAGE,
        active: true,
      },
    });
  }

  await prisma.product.updateMany({
    where: { slug: { in: ["croissant", "blueberry-muffin"] } },
    data: { active: false },
  });

  for (const key of allContentKeys()) {
    await prisma.siteContent.upsert({
      where: { key },
      update: {},
      create: {
        key,
        value: DEFAULT_SITE_CONTENT[key] ?? "",
      },
    });
  }

  console.log("Seed complete.");
  console.log(`Admin login: ${ADMIN_EMAIL} / ${ADMIN_PASSWORD}`);
  console.log(`Images: ${FRONT_IMAGE} (default), ${SIDE_IMAGE} (hover)`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
