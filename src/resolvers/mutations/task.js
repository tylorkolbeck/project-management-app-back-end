const { isAssociatedWithProject } = require("../../utils");

async function addTaskToMilestone(parent, args, context) {
  const associatedWithProject = await isAssociatedWithProject(
    context,
    args.projectId
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

async function deleteTask(parent, args, context) {
  const associatedWithProject = await isAssociatedWithProject(
    context,
    args.projectId
  );

  if (associatedWithProject) {
    return context.prisma.task.delete({
      where: {
        id: Number(args.taskId)
      }
    });
  } else {
    throw new Error("You are not associated with this project");
  }
}

module.exports = {
  addTaskToMilestone,
  deleteTask
};
