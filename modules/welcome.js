var exports = module.exports = {};

exports.roles = function roles(roles) {
  const specialRoleNames = ["@everyone", "fusion", "membro", "familiafusion1", "familiafusion2", "bot"];
  const matchmakingRoleNames = ["singles", "doubles", "secrethitler", "minecraft", "rivals"];

  var selfAssignableRoles = [];
  var matchmakingRoles = [];

  roles.forEach(function (value, i){
    if (matchmakingRoleNames.indexOf(value.name) != -1) {
        matchmakingRoles.push(value);
    } else if (specialRoleNames.indexOf(value.name) == -1) {
        selfAssignableRoles.push(value);
    }
  });

  const description = "matchmaking: " + matchmakingRoles.join(", ") + "\n\n" +
                      "outros: " + selfAssignableRoles.join(", ")

  return description
}