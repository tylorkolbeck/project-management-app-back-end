function links(parent, args, context) {
  return context.prisma.user.findOne({ where: { id: parent.id } }).links();
}

// function User(parent, args, context) {
//   return "Custom message";
// }

module.exports = {
  links
  // User
};
