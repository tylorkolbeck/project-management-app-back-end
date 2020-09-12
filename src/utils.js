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

async function isProjectOwner(context, projectId, ownerId) {
  const owner = await context.prisma.project
    .findOne({
      where: {
        id: Number(projectId)
      }
    })
    .owner();

  return owner.id === ownerId;
}

async function isAssociatedWithProject(context, projectId, userId) {
  const projectToCheck = await context.prisma.project.findOne({
    where: {
      id: Number(projectId)
    },
    include: {
      assignees: true,
      owner: true
    }
  });

  if (
    projectToCheck.ownerId === userId ||
    projectToCheck.assignees.filter((user) => user.id === userId).length > 0
  ) {
    return true;
  } else {
    return false;
  }
}

module.exports = {
  APP_SECRET,
  isProjectOwner,
  isAssociatedWithProject,
  getUserId,
  authenticate
};
