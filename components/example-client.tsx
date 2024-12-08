"use client";
import { useTranslation } from "react-i18next"; // the client side function for translations from `react`

export default function Greeting() {
  const { t } = useTranslation(["Common"]);

  // in this case I used username variable interpolation, so pass that as well
  const name = "Peter Fox";
  return <div>{t("welcome", { name })}
  <h2>test: {t("admin_dashboard")}
    </h2></div>;
}
