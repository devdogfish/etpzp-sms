import { ColorPalette } from "@/components/ColorPalette";
import { ColorPalette2 } from "@/components/ColorPalette2";

export default function Page() {
  return (
    <div className="flex flex-col gap-3">
      {/* <h1>COLOR PALETTE 1</h1> */}
      {/* <ColorPalette /> */}
      {/* <h1>COLOR PALETTE 2</h1> */}
      <div className="max-h-[1400px]">
      <ColorPalette2 />
      </div>
      <div>
        <h1>Color palette <strong>2</strong> structure</h1>
        Base colors (Background, Foreground) <br />
        Structural elements (Card, Popover) <br />
        Interactive elements (Primary, Secondary, Accent) <br />
        Semantic colors (Muted, Destructive) <br />
        Utility colors (Border, Input, Ring) <br />
        Chart colors
        <button className="hover:bg-primary/90 bg-primary">Hello Hover me</button>
      </div>
    </div>
  );
}
