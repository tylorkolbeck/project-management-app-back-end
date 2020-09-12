function milestones(parent, args, context) {
  return context.prisma.project
    .findOne({ where: { id: parent.id } })
    .milestones();
}

function owner(parent, args, context) {
  return context.prisma.project
    .findOne({
      where: {
        id: parent.id
      }
    })
    .owner();
}

function assignees(parent, args, context) {
  return context.prisma.project
    .findOne({
      where: {
        id: parent.id
      }
    })
    .assignees();
}
module.exports = {
  milestones,
  owner,
  assignees
};
