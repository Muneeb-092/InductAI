const prisma = require("../config/db");

exports.searchSkills = async (query) => {
  return await prisma.skill.findMany({
    where: {
      name: {
        startsWith: query,
        mode: "insensitive",
      },
    },
    take: 10,
    orderBy: {
      name: "asc",
    },
  });
};