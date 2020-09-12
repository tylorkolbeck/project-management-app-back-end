const { isAssociatedWithProject } = require("../../utils");

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
  addTaskToMilestone
};
