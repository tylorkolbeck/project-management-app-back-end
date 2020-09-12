async function tasks(parent, args, context) {
  const tasks = await context.prisma.project
    .findOne({ where: { id: parent.id } })
    .milestones.tasks();
}

module.exports = {
  tasks
};
