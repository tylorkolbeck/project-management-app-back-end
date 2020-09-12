const { getUserId } = require("../utils");

function feed(parent, args, context, info) {
  return context.prisma.link.findMany();
}

function users(parent, args, context, info) {
  return context.prisma.user.findMany({
    include: {
      projects: {
        include: {
          owner: true
        }
      },
      projectsAssigned: {
        include: {
          owner: true,
          assignees: true
        }
      }
    }
  });
}

// TODO: MAKE SURE THAT THE PERSON RETRIEVING THE RECORD IS ALLOWED TO ACCESS THE PROJECT
// function project(parent, args, context, info) {
//   return context.prisma.project.findOne({
//     where: {
//       id: Number(args.projectId)
//     },
//     include: {
//       assignees: true,
//       owner: true,
//       milestones: true
//     }
//   });
// }

// TODO: MAKE SURE THE USER IS LOGGED IN FIRST
async function user(parent, args, context) {
  if (context.user.id) {
    const user = await context.prisma.user.findOne({
      where: {
        id: Number(context.user.id)
      }
    });

    return {
      name: user.name,
      id: user.id
    };
  } else {
    throw new Error("You are not logged in.");
  }
}

function project(parent, args, context) {
  // const userId = getUserId(context);

  return context.prisma.project.findOne({
    where: { id: Number(args.projectId) }
  });
}

module.exports = {
  feed,
  users,
  project,
  user
};
