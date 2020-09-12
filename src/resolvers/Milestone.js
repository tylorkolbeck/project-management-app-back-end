async function tasks(parent, args, context) {
  const tasks = await context.prisma.milestone
    .findOne({ where: { id: parent.id } })
    .tasks();
  console.log(tasks);
  return tasks;
}

module.exports = {
  tasks
};
