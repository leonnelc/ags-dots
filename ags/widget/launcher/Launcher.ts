import { type Binding } from "lib/utils"
import PopupWindow, { Padding } from "widget/PopupWindow"
import icons from "lib/icons"
import options from "options"
import * as AppLauncher from "./AppLauncher"
import * as ShRun from "./ShRun"

const { width, margin } = options.launcher

function Launcher() {
    const favs = AppLauncher.Favorites()
    const applauncher = AppLauncher.Launcher()
    const sh = ShRun.ShRun()
    const shicon = ShRun.Icon()

    function HelpButton(cmd: string, desc: string | Binding<string>) {
        return Widget.Box(
            { vertical: true },
            Widget.Separator(),
            Widget.Button(
                {
                    class_name: "help",
                    on_clicked: () => {
                        entry.grab_focus()
                        entry.text = `:${cmd} `
                        entry.set_position(-1)
                    },
                },
                Widget.Box([
                    Widget.Label({
                        class_name: "name",
                        label: `:${cmd}`,
                    }),
                    Widget.Label({
                        hexpand: true,
                        hpack: "end",
                        class_name: "description",
                        label: desc,
                    }),
                ]),
            ),
        )
    }

    const help = Widget.Revealer({
        child: Widget.Box(
            { vertical: true },
            HelpButton("sh", "run a binary"),
            Widget.Box(),
        ),
    })

    const entry = Widget.Entry({
        hexpand: true,
        primary_icon_name: icons.ui.search,
        on_accept: ({ text }) => {
            if (text?.startsWith(":sh"))
                sh.run(text.substring(3))
            else
                applauncher.launchFirst()

            App.toggleWindow("launcher")
            entry.text = ""
        },
        on_change: ({ text }) => {
            text ||= ""
            favs.reveal_child = text === ""
            help.reveal_child = text.split(" ").length === 1 && text?.startsWith(":")

            if (text?.startsWith(":sh"))
                sh.filter(text.substring(3))
            else
                sh.filter("")

            if (!text?.startsWith(":"))
                applauncher.filter(text)
        },
    })

    function focus() {
        entry.text = "Search"
        entry.set_position(-1)
        entry.select_region(0, -1)
        entry.grab_focus()
        favs.reveal_child = true
    }

    const layout = Widget.Box({
        css: width.bind().as(v => `min-width: ${v}pt;`),
        class_name: "launcher",
        vertical: true,
        vpack: "start",
        setup: self => self.hook(App, (_, win, visible) => {
            if (win !== "launcher")
                return

            entry.text = ""
            if (visible)
                focus()
        }),
        children: [
            Widget.Box([entry , shicon]),
            favs,
            help,
            applauncher,
            sh,
        ],
    })

    return Widget.Box(
        { vertical: true, css: "padding: 1px" },
        Padding("launcher", {
            css: margin.bind().as(v => `min-height: ${v}pt;`),
            vexpand: false,
        }),
        layout,
    )
}

export default () => PopupWindow({
    name: "launcher",
    layout: "top",
    child: Launcher(),
})
