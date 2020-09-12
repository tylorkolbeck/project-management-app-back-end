const { getUserId } = require("../utils");

function links(parent, args, context) {
  return context.prisma.user.findOne({ where: { id: parent.id } }).links();
}

function projectsAssigned(parent, args, context) {
  return context.prisma.user
    .findOne({ where: { id: parent.id } })
    .projectsAssigned();
}

function projects(parent, args, context) {
  console.log(parent.id);
  return context.prisma.user
    .findOne({
      where: {
        id: parent.id
      }
    })
    .projects();
}

module.exports = {
  links,
  projects,
  projectsAssigned
};
