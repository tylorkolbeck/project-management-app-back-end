const { getUserId } = require("../utils");

function links(parent, args, context) {
  return context.prisma.user.findOne({ where: { id: parent.id } }).links();
}

function projectsAssigned(parent, args, context) {
  return context.prisma.user
    .findOne({ where: { id: context.user.id } })
    .projectsAssigned();
}

function projects(parent, args, context) {
  return context.prisma.user
    .findOne({
      where: {
        id: Number(context.user.id)
      }
    })
    .projects();
}

module.exports = {
  links,
  projects,
  projectsAssigned
};
