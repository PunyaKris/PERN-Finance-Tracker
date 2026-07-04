import prisma from "../utils/prisma.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function registerService(username, email, password) {
  const passwordHash = await bcrypt.hash(password, 10);

  let user;

  try {
    user = await prisma.user.create({
      data: {
        username: username,
        email: email,
        passwordHash: passwordHash,
      },
    });
  } catch (error) {
    if (error.code === "P2002") throw new Error("Email already exists");

    throw error;
  }

  return user;
}

export async function loginService(email, password) {
  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });

  if (!user) throw new Error("user does not exist");

  const isMatch = await bcrypt.compare(password, user.passwordHash);

  if (!isMatch) throw new Error("Invalid Password");

  const token = jwt.sign(
    {
      userId: user.id,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    },
  );

  return token;
}
