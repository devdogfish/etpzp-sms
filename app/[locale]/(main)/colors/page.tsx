import ColorPalette from "@/components/color-palette";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResizablePanel } from "@/components/ui/resizable";
import { ScrollArea } from "@radix-ui/react-scroll-area";

export default function Page() {
  return (
    <ResizablePanel className="flex flex-col gap-3">
      <ScrollArea className="h-full">
        <ColorPalette />
        <div className="flex flex-col p-3 gap-3">
          <Card>
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
    </ResizablePanel>
  );
}
