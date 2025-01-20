import LoginForm from "@/components/login-form";
import { activeDirectoryConfig } from "@/lib/auth.config";
import ActiveDirectory from "activedirectory2";

export default async function LoginPage() {
  return (
    <main className="flex items-center justify-center w-screen h-screen p-3">
      <LoginForm />
    </main>
  );
}

async function TestActiveDirectory() {
  var ad = new ActiveDirectory(activeDirectoryConfig);
  var username = "user@domain.com";
  var groupName = "Utilizadores-SMS";
  ad.getUsersForGroup(groupName, function (err, users) {
    if (err) {
      console.log("ERROR: " + JSON.stringify(err));
      return;
    }

    if (!users) console.log("Group: " + groupName + " not found.");
    else {
      console.log(JSON.stringify(users));
    }
  });

  // ad.isUserMemberOf(
  //   activeDirectoryConfig.username,
  //   groupName,
  //   function (err, isMember) {
  //     if (err) {
  //       console.log("ERROR: " + JSON.stringify(err));
  //       return;
  //     }

  //     console.log(username + " isMemberOf " + groupName + ": " + isMember);
  //   }
  // );
  // ad.findGroups("CN=*SMS*", function (err, groups) {
  //   if (err) {
  //     console.log("ERROR: " + JSON.stringify(err));
  //     return;
  //   }

  //   if (!groups || groups.length == 0) console.log("No groups found.");
  //   else {
  //     console.log("findGroups: " + JSON.stringify(groups));
  //     console.log(groups);
  //   }
  // });
}
