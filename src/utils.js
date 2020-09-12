const jwt = require("jsonwebtoken");

// TODO: SET THIS IN ENV VARIABLE
const APP_SECRET = process.env.JWT_SECRET;

function getUserId(context) {
  const Authorization = context.request.get("Authorization");

  if (Authorization) {
    const token = Authorization.replace("Bearer ", "");
    const { userId } = jwt.verify(token, APP_SECRET);
    return userId;
  }

  throw new Error("Not Authenticated");
}

function authenticate(header) {
  if (header) {
    const token = header.replace("Bearer ", "");
    const { userId } = jwt.verify(token, APP_SECRET);
    return userId;
  }

  throw new Error("Not Authenticated");
}

async function isProjectOwner(context, projectId) {
  const owner = await context.prisma.project
    .findOne({
      where: {
        id: Number(projectId)
      }
    })
    .owner();

  return owner.id === context.user.id;
}

async function isAssociatedWithProject(context, projectId) {
  const projectToCheck = await context.prisma.project.findOne({
    where: {
      id: Number(projectId)
    },
    include: {
      assignees: true,
      owner: true
    }
  });

  if (!projectToCheck) {
    return false;
  }

  if (
    projectToCheck.ownerId === context.user.id ||
    projectToCheck.assignees.filter((user) => user.id === context.user.id)
      .length > 0
  ) {
    return projectToCheck;
  } else {
    return false;
  }
}

async function isAssociatedWithMilestone(context, id) {
  const { projectId } = await context.prisma.milestone.findOne({
    where: {
      id: Number(id)
    }
  });

  const isAssociated = await isAssociatedWithProject(context, projectId);

  return isAssociated;
}

module.exports = {
  APP_SECRET,
  isProjectOwner,
  isAssociatedWithProject,
  getUserId,
  authenticate,
  isAssociatedWithMilestone
};
