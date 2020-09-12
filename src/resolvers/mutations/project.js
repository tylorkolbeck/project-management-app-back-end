const { isProjectOwner } = require("../../utils");

async function assignUserToProject(parent, args, context, info) {
  const projectOwner = await isProjectOwner(
    context,
    args.projectId,
    context.userId
  );

  if (!projectOwner) {
    throw new Error("You must be the project owner to assign users.");
  }

  const projectToEdit = await context.prisma.project.findOne({
    where: {
      id: Number(args.projectId)
    },
    include: {
      assignees: true
    }
  });

  const userToAssign = await context.prisma.user.findOne({
    where: {
      id: Number(args.userIdToAssign)
    }
  });

  if (!userToAssign) {
    throw new Error(`This user you tried to add does not exist.`);
  }

  if (!projectToEdit) {
    throw new Error(`Project not found.`);
  }

  // If the user making the request is the owner of the project
  // assignee the requested user
  if (Number(projectToEdit.ownerId) === Number(args.userIdToAssign)) {
    throw new Error(
      "You can not assign yourself to your own project because you are the owner."
    );
  }

  if (projectOwner) {
    await context.prisma.project.update({
      where: {
        id: Number(args.projectId)
      },
      data: {
        assignees: { connect: { id: Number(args.userIdToAssign) } }
      },
      include: {
        assignees: true,
        owner: true
      }
    });

    return userToAssign;
  } else {
    throw new Error("You do not own this project");
  }
}

async function createProject(parent, args, context, info) {
  const newProject = await context.prisma.project.create({
    data: {
      name: args.name,
      description: args.description ? args.description : "",
      owner: { connect: { id: context.user.id } }
    },
    include: {
      owner: true
    }
  });

  return newProject;
}

module.exports = {
  assignUserToProject,
  createProject
};
