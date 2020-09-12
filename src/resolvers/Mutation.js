const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {
  APP_SECRET,
  getUserId,
  isProjectOwner,
  isAssociatedWithProject
} = require("../utils");

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

function post(parent, args, context, info) {
  // const userId = getUserId(context);

  const newLink = context.prisma.link.create({
    data: {
      url: args.url,
      description: args.description,
      postedBy: { connect: { id: context.userId } }
    }
  });

  context.pubsub.publish("NEW_LINK", newLink);

  return newLink;
}

async function createProject(parent, args, context, info) {
  // const userId = getUserId(context);

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

async function vote(parent, args, context, info) {
  // const userId = getUserId(context);

  const vote = await context.prisma.vote.findOne({
    where: {
      linkId_userId: {
        linkId: Number(args.linkId),
        userId: context.userId
      }
    }
  });

  if (Boolean(vote)) {
    throw new Error(`Already voted for link: ${args.linkId}`);
  }

  const newVote = context.prisma.vote.create({
    data: {
      user: { connect: { id: userId } },
      link: { connect: { id: Number(args.linkId) } }
    }
  });

  context.pubsub.publish("NEW_VOTE", newVote);

  return newVote;
}

async function assignUserToProject(parent, args, context, info) {
  // const userId = getUserId(context);
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
  // assigne the requested user
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

async function removeSelfFromProject(parent, args, context) {
  // const userId = getUserId(context);

  const deletedUser = await context.prisma.user.update({
    where: {
      id: context.userId
    },
    data: {
      projectsAssigned: {
        disconnect: [{ id: Number(args.projectId) }]
      }
    }
  });
  return deletedUser;
}

async function deleteProject(parent, args, context) {
  // const userId = getUserId(context);
  const projectOwner = await isProjectOwner(
    context,
    args.projectId,
    context.userId
  );

  if (projectOwner) {
    return await context.prisma.project.delete({
      where: {
        id: Number(args.projectId)
      }
    });
  } else {
    throw new Error("You need to be the owner to delete this project");
  }
}

async function createMilestone(parent, args, context) {
  // const userId = getUserId(context);
  const associatedWithProject = await isAssociatedWithProject(
    context,
    args.projectId,
    context.userId
  );

  if (associatedWithProject) {
    return context.prisma.milestone.create({
      data: {
        title: args.title,
        project: {
          connect: {
            id: Number(args.projectId)
          }
        },
        creator: {
          connect: {
            id: context.userId
          }
        }
      },
      include: {
        creator: true,
        project: true
      }
    });
  }
}

async function addTaskToMilestone(parent, args, context) {
  const associatedWithProject = await isAssociatedWithProject(
    context,
    args.projectId,
    context.user.id
  );

  if (associatedWithProject) {
    return context.prisma.task.create({
      data: {
        name: args.name,
        creator: {
          connect: {
            id: context.user.id
          }
        },
        milestone: {
          connect: {
            id: Number(args.milestoneId)
          }
        }
      }
    });
  } else {
    throw new Error("You are not associated with this project");
  }
}

module.exports = {
  signup,
  login,
  post,
  vote,
  createProject,
  assignUserToProject,
  removeSelfFromProject,
  deleteProject,
  createMilestone,
  addTaskToMilestone
};
