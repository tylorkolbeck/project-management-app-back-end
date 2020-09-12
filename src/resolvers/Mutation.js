const userMutations = require("./mutations/user");
const milestoneMutations = require("./mutations/milestone");
const taskMutations = require("./mutations/task");
const projectMutations = require("./mutations/project");

function post(parent, args, context, info) {
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

async function vote(parent, args, context, info) {
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

async function removeSelfFromProject(parent, args, context) {
  const deletedUser = await context.prisma.user.update({
    where: {
      id: context.user.id
    },
    data: {
      projectsAssigned: {
        disconnect: [{ id: Number(args.projectId) }]
      }
    }
  });
  return deletedUser;
}

module.exports = {
  ...userMutations,
  ...milestoneMutations,
  ...taskMutations,
  ...projectMutations,
  post,
  vote,
  removeSelfFromProject
};
