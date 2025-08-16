import icons from "lib/icons"
import options from "options"
import PanelButton from "../PanelButton"

const battery = await Service.import("battery")
const { bar, showPercentage, low } = options.bar.battery

const Indicator = () => Widget.Icon({
    setup: self => self.hook(battery, () => {
        self.size = 24
        self.icon = `battery-level-${Math.trunc(Math.trunc(battery.percent / 10)*10)}${battery.charging ? "-charging" : ""}-symbolic`
    }),
})

const PercentLabel = () => Widget.Revealer({
    transition: "slide_right",
    click_through: true,
    reveal_child: showPercentage.bind(),
    child: Widget.Label({
        label: battery.bind("percent").as(p => `${p}%`),
    }),
})


const Regular = () => Widget.Box({
    class_name: "regular",
    children: [
        Indicator(),
        PercentLabel(),
    ],
})

export default () => PanelButton({
    class_name: "battery-bar",
    hexpand: false,
    on_clicked: () => { showPercentage.value = !showPercentage.value },
    visible: battery.bind("available"),
    child: Widget.Box({
        expand: true,
        visible: battery.bind("available"),
        child: Regular(),
    }),
    setup: self => self
        .hook(bar, w => w.toggleClassName("bar-hidden", bar.value === "hidden"))
        .hook(battery, w => {
            w.toggleClassName("charging", battery.charging || battery.charged)
            w.toggleClassName("low", battery.percent < low.value)
        }),
})
