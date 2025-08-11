import PanelButton from "../PanelButton";
import cpu from "service/cpu";
import { barVisible } from "lib/variables";

barVisible.connect("changed", (b) => {
  // stop polling when bar is not visible and start again when visible
  if (!b.value && cpu.is_polling) cpu.stop_polling();
  else if (b.value && !cpu.is_polling) cpu.start_polling();
});

const Progress = () => Widget.CircularProgress({
    classNames: ["circular-progress", "cpu-progress"],
    rounded: false,
    inverted: false,
    startAt: 0.75,
    value: cpu.bind("percent").as(p => p / 100),
  })

export default () =>
  PanelButton({
    class_name: "cpu-button",
    hexpand: false,
    visible: cpu.bind("available"),
    child: Widget.Box({
      expand: false,
      child: Progress(),
    }),
    setup: (self) => {
      cpu.start_polling();
      self.hook(cpu, () => {
        self.toggleClassName("low", cpu.percent >= 30 && cpu.percent < 90)
        self.toggleClassName("high", cpu.percent >= 90);
      }, "percent");
    },
    tooltipText: cpu.bind("percent").as( p => `CPU: ${p}%`)
  });
