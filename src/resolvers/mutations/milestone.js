const { isAssociatedWithProject } = require("../../utils");

async function createMilestone(parent, args, context) {
  const associatedWithProject = await isAssociatedWithProject(
    context,
    args.projectId,
    context.user.id
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
            id: context.user.id
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

module.exports = {
  createMilestone
};
