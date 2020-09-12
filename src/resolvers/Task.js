function creator(parent, args, context) {
  return context.prisma.user.findOne({
    where: {
      id: parent.creatorId
    }
  });
}

module.exports = {
  creator
};
