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
module.exports = {
  milestones,
  owner
};
