const { isAssociatedWithProject } = require("../../utils");

async function project(parent, args, context) {
  const isAssociated = await isAssociatedWithProject(context, args.projectId);

  if (isAssociated) {
    return context.prisma.project.findOne({
      where: {
        id: Number(args.projectId)
      }
    });
  } else {
    throw new Error("You are not part of this project.");
  }
}

module.exports = {
  project
};
