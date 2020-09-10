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
function project(parent, args, context, info) {
  return context.prisma.project.findOne({
    where: {
      id: Number(args.projectId)
    },
    include: {
      assignees: true,
      owner: true
    }
  });
}

// TODO: THIS SHOULD RETURN PROJECTS FOR A GIVEN PROJECT ID NOT ALL PROJECTS
function projects(parent, args, context, info) {
  return context.prisma.project.findMany({
    include: {
      owner: true,
      assignees: true
    }
  });
}

module.exports = {
  feed,
  users,
  projects,
  project
};
