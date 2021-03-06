const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { APP_SECRET } = require("../../utils");

async function signup(parent, args, context, info) {
  const password = await bcrypt.hash(args.password, 10);

  const user = await context.prisma.user.create({
    data: { ...args, password }
  });

  const token = jwt.sign({ userId: user.id }, APP_SECRET, {
    algorithm: "HS256"
  });

  return {
    token,
    user
  };
}

async function login(parent, args, context, info) {
  const user = await context.prisma.user.findOne({
    where: { email: args.email }
  });

  if (!user) {
    throw new Error("Email does not exist.");
  }

  const validPassword = await bcrypt.compare(args.password, user.password);

  if (!validPassword) {
    throw new Error("Invalid Password");
  }

  const token = jwt.sign(
    { userId: user.id, email: user.email, name: user.name },
    APP_SECRET
  );

  return {
    user,
    token
  };
}

async function user(parent, args, context) {
  let newPassword;
  if (args.password) {
    newPassword = await bcrypt.hash(args.password, 10);
  }

  return context.prisma.user.update({
    where: {
      id: context.user.id
    },
    data: {
      avatar: args.avatar,
      name: args.name,
      email: args.email,
      password: newPassword
    }
  });
}

function deleteUser(parent, args, context) {
  return context.prisma.user.delete({
    where: {
      id: context.user.id
    }
  });
}

module.exports = {
  signup,
  login,
  user,
  deleteUser
};
