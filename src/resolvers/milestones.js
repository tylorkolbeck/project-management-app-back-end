async function tasks(parent, args, context) {
  const tasks = await context.prisma.project
    .findOne({ where: { id: parent.id } })
    .milestones.tasks();

  console.log(tasks);
}

module.exports = {
  tasks
};
