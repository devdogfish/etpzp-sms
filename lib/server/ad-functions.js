const config = {
  url: process.env.AD_URL,
  baseDN: process.env.AD_BASE_DN,
  username: process.env.AD_USERNAME,
  password: process.env.AD_PASSWORD,
};
const ad = new ActiveDirectory(config);

const groupName = "Utilizadores-SMS";

await ad.authenticate("2812@etpzp.pt", "Lachsflosse05", function (err, auth) {
  if (err) {
    console.log("ERROR: " + JSON.stringify(err));
    return;
  }

  if (auth) {
    console.log("Authenticated!");
  } else {
    console.log("Authentication failed!");
  }
});

// await ad.groupExists(groupName, function (err, exists) {
//   if (err) {
//     console.log("ERROR: " + JSON.stringify(err));
//     return;
//   }

//   console.log(groupName + " exists: " + exists);
// });
// await ad.findGroup(groupName, function (err, group) {
//   if (err) {
//     console.log("ERROR: " + JSON.stringify(err));
//     return;
//   }

//   if (!group) console.log("Group: " + groupName + " not found.");
//   else {
//     console.log(group);
//     console.log("Members: " + (group.member || []).length);
//   }
// });
// await ad.isUserMemberOf(config.username, groupName, function (err, isMember) {
//   if (err) {
//     console.log("ERROR: " + JSON.stringify(err));
//     return;
//   }

//   console.log(config.username + " isMemberOf " + groupName + ": " + isMember);
// });
