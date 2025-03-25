import LoginForm from "@/components/login-form";
import { activeDirectoryConfig } from "@/lib/auth/config";
import ActiveDirectory from "activedirectory2";
import { Metadata } from "next";

export default async function LoginPage() {
  // getActiveDirectoryData();
  return (
    <main className="flex items-center justify-center w-screen h-screen p-3">
      <LoginForm />
    </main>
  );
}
export const metadata: Metadata = {
  title: `${process.env.APP_NAME} - Login`,
  description: "Login in to ETPZP-SMS with your active directory account.",
};

async function getActiveDirectoryData() {
  var ad = new ActiveDirectory(activeDirectoryConfig);
  var groupName = "Utilizadores-SMS";
  ad.getUsersForGroup(groupName, function (err, users) {
    if (err) {
      console.log("ERROR: " + JSON.stringify(err));
      return;
    }

    if (!users) console.log("Group: " + groupName + " not found.");
    else {
      console.log(users);
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
