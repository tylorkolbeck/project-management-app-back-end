const { isAssociatedWithProject } = require("../../utils");

async function createMilestone(parent, args, context) {
  const associatedWithProject = await isAssociatedWithProject(
    context,
    args.projectId
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

async function milestone(parent, args, context) {
  const associatedWithProject = await isAssociatedWithProject(
    context,
    args.projectId
  );

  if (associatedWithProject) {
    return context.prisma.milestone.update({
      where: {
        id: Number(args.milestoneId)
      },
      data: {
        title: args.title,
        description: args.description,
        dueDate: args.dueDate
      }
    });
  } else {
    throw new Error(
      "You are not a part of the project that contains this milestone"
    );
  }
}

module.exports = {
  createMilestone,
  milestone
};
