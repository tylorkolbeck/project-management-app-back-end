const {
  isAssociatedWithProject,
  isAssociatedWithMilestone
} = require("../../utils");

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
  } else {
    throw new Error("You are not associated with this project");
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

async function deleteMilestone(parent, args, context) {
  const isAssociated = await isAssociatedWithMilestone(context, args.id);
  if (isAssociated) {
    return context.prisma.milestone.delete({
      where: {
        id: Number(args.id)
      }
    });
  } else {
    throw new Error("You do not have permission to delete this milestone");
  }
}

module.exports = {
  createMilestone,
  milestone,
  deleteMilestone
};
