export function getGroups(ad, query) {
  ad.findGroups(query, function (err, groups) {
    if (err) {
      console.log("ERROR: " + JSON.stringify(err));
      return err;
    }

    if (!groups || groups.length == 0) console.log("No groups found.");
    else {
      console.log(JSON.stringify(groups, null, 2));
      return formattedGroups;
    }
  });
}

export function getUsersForGroup(ad, groupName) {
  ad.getUsersForGroup(groupName, function (err, users) {
    if (err) {
      console.log("ERROR: " + JSON.stringify(err));
      return;
    }

    if (!users || users.length === 0)
      console.log(
        "Group: '" + groupName + "' not found or doesn't have any users."
      );
    else {
      console.log(JSON.stringify(users, null, 2));
    }
  });
}

export function findUser(ad, sAMAccountName) {
  // Any of the following username types can be searched on

  // Any of the following username types can be searched on
  var userPrincipalName = "username@domain.com";
  var dn = "CN=Smith\\, John,OU=Users,DC=domain,DC=com";

  // Find user by a sAMAccountName
  ad.findUser(sAMAccountName, function (err, user) {
    if (err) {
      console.log("ERROR: " + JSON.stringify(err));
      return;
    }

    if (!user) console.log("User: " + sAMAccountName + " not found.");
    else console.log(JSON.stringify(user));
  });
}
