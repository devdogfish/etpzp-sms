import initTranslations from "@/app/i18n";
import ColorPalette from "@/components/color-palette";
import { PageHeader } from "@/components/headers";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

export default async function Page() {
  return (
    <>
      <PageHeader title="Color Palette">asd</PageHeader>
      <ScrollArea className="h-[calc(100vh-50px)] p-3">
        <ColorPalette />
        <div className="flex flex-col gap-3">
          <Card className="mt-3">
            <CardHeader>
              <CardTitle>Color palette explained</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="flex flex-col gap-1">
                <li>Base colors (Background, Foreground)</li>
                <li>Structural elements (Card, Popover)</li>
                <li>Interactive elements (Primary, Secondary, Accent)</li>
                <li>Semantic colors (Muted, Destructive)</li>
                <li>Utility colors (Border, Input, Ring)</li>
                <li>Chart colors (used for charts)</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="flex flex-col gap-1">
                <li>
                  <code>ACCENT</code> and <code>MUTED</code> are very similar
                  colors
                </li>
                <li>
                  Newly components don't use global colors. Mostly it's slate
                  color, you just have to replace it and then you can also
                  delete all the <code>dark:</code> classNames.
                </li>
                <li>I used border color for resizable sidebar handles too</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </ScrollArea>
    </>
  );
}
