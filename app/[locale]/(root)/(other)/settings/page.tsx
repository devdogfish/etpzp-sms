"use client";
import initTranslations from "@/app/[locale]/i18n";
import { PageHeader, SectionHeader } from "@/components/header";
import {
  LanguageChanger,
  ThemeModeToggle,
  ThemeColorChanger,
  ProfileSettings,
} from "@/components/settings";
import { Button } from "@/components/ui/button";
import { updateSettings } from "@/lib/actions/user.actions";
import { SettingsSchema } from "@/lib/form.schemas";
import { ActionResponse } from "@/types/action";
import { useActionState } from "react";
import { useTranslation } from "react-i18next";
import { z } from "zod";

const initialState: ActionResponse<z.infer<typeof SettingsSchema>> = {
  success: false,
  message: [],
};
export default function Settings() {
  const { t } = useTranslation(["Navigation"]);

  const [serverState, action] = useActionState(updateSettings, initialState);
  // async function updateUser(formData: FormData) {
  //   "use server";
  //   console.log("updating user settings..");
  //   console.log(formData);
  // }
  return (
    <>
      <PageHeader title={t("SETTING")} />
      <form className="p-4 space-y-12 h-[calc(100vh-52px)] overflow-y-scroll" action={action}>
        <SectionHeader
          title="Language"
          subtitle="Select your preferred language for a personalized experience"
        >
          <LanguageChanger />
        </SectionHeader>

        <SectionHeader
          title="Appearance"
          subtitle="Customize the look and feel of your app"
        >
          <ThemeColorChanger />
          <ThemeModeToggle />
        </SectionHeader>

        <SectionHeader
          title="Profile"
          subtitle="Manage your personal information"
        >
          {/* <form action={updateUser} className="space-y-5"> */}
          <ProfileSettings />
          <Button type="submit">Submit</Button>
          {/* </form> */}
        </SectionHeader>
      </form>
    </>
  );
}
