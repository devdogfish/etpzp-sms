import { Button } from "@/components/ui/button";

export default function UI() {
  return (
    <div>
      <div>
        <h1>Buttons</h1>
        <div className="flex gap-1">
          <Button>Set Goal</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="link">Link</Button>
        </div>
        Tip: use <i>default</i> in combination with <i>ghost</i> in popup modals (submit and cancel).
      </div>
      <div>
        <h1>Popover</h1>
        <div></div>
        Tip use <i>popover</i> color and <i>popoverForeground</i> for tooltips and something like that. It is often times the same as primary but separated in a category so you can target it.
      </div>
    </div>
  );
}
