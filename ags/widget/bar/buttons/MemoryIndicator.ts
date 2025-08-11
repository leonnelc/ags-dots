import PanelButton from "../PanelButton";
import memory from "service/memory";
import { barVisible } from "lib/variables";

barVisible.connect("changed", (b) => {
  // stop polling when bar is not visible and start again when visible
  if (!b.value && memory.is_polling) memory.stop_polling();
  else if (b.value && !memory.is_polling) memory.start_polling();
});

const Progress = () => Widget.CircularProgress({
    classNames: ["circular-progress", "memory-progress"],
    rounded: false,
    inverted: false,
    startAt: 0.75,
    value: memory.bind("percent").as(p => p / 100),
})

export default () =>
  PanelButton({
    class_name: "memory-button",
    hexpand: false,
    visible: memory.bind("available"),
    child: Widget.Box({
      expand: false,
      child: Progress(),
    }),
    setup: (self) => {
      memory.start_polling();
      self.hook(memory, () => {
        self.toggleClassName("low", memory.percent >= 30 && memory.percent < 90)
        self.toggleClassName("high", memory.percent >= 90);
      }, "percent");
    },
    tooltipText: memory.bind("usage").as( u => `RAM: ${u}MB`)
  });
