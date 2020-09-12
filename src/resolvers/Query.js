const { getUserId, isAssociatedWithProject } = require("../utils");
const projectQueries = require("./queries/project");

// TODO: Remove this function before deploying
async function adminGetUsers(parent, args, context, info) {
  const users = await context.prisma.user.findMany({
    include: {
      projects: {
        include: {
          milestones: {
            include: {
              tasks: true
            }
          }
        }
      }
    }
  });

  return users;
}

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

    return user;
  } else {
    throw new Error("You are not logged in.");
  }
}

// function project(parent, args, context) {
//   const project = isAssociatedWithProject(
//     context,
//     args.projectId,
//     context.user.id
//   );

//   if (project) {
//     return project;
//   } else {
//     throw new Error("You are not part of this project.");
//   }
// }

module.exports = {
  feed,
  users,
  // project,
  user,
  adminGetUsers,
  ...projectQueries
};
