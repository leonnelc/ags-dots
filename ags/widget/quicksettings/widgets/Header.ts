import icons from "lib/icons"
import { uptime } from "lib/variables"
import options from "options"
import powermenu, { Action } from "service/powermenu"
import GLib from "gi://GLib?version=2.0"

const battery = await Service.import("battery")
const { image, size } = options.quicksettings.avatar
if (image) image.value = GLib.file_test(image.value, GLib.FileTest.EXISTS) ? image.value : "";
function up(up: number) {
    const h = Math.floor(up / 60)
    const m = Math.floor(up % 60)
    const d = Math.floor(up /60/60)
    if (h >= 24) 
      return `${d}d ${h%24 < 10 ? "0" + h%24 : h%24}h`;
    return `${h}h ${m < 10 ? "0" + m : m}m`
}

const Avatar = () => Widget.Box({
    class_name: "avatar",
    visible: image.bind().as( img => !!img),
    css: Utils.merge([image.bind(), size.bind()], (img, size) => `
        min-width: ${size}px;
        min-height: ${size}px;
        background-image: url('${img}');
        background-size: cover;
    `),
})

const SysButton = (action: Action) => Widget.Button({
    vpack: "center",
    child: Widget.Icon(icons.powermenu[action]),
    on_clicked: () => powermenu.action(action),
})

export const Header = () => Widget.Box(
    { class_name: "header horizontal" },
    Avatar(),
    Widget.Box({
        vertical: true,
        vpack: "center",
        children: [
            Widget.Box({
                visible: battery.bind("available"),
                children: [
                    Widget.Icon({ icon: battery.bind("icon_name") }),
                    Widget.Label({ label: battery.bind("percent").as(p => `${p}%`), tooltipText: "Battery"}),
                ],
            }),
            Widget.Box([
                Widget.Icon({ icon: icons.ui.time }),
                Widget.Label({ label: uptime.bind().as(up), tooltipText: "Uptime"}),
            ]),
        ],
    }),
    Widget.Box({ hexpand: true }),
    Widget.Button({
        vpack: "center",
        child: Widget.Icon(icons.ui.settings),
        on_clicked: () => {
            App.closeWindow("quicksettings")
            App.closeWindow("settings-dialog")
            App.openWindow("settings-dialog")
        },
    }),
    SysButton("logout"),
    SysButton("shutdown"),
)
