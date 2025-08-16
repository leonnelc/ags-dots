import { Menu, ArrowToggleButton } from "../ToggleButton"
import icons from "lib/icons.js"
import { dependencies } from "lib/utils"
const { wifi } = await Service.import("network")
import { passwordPopupLabel, passwordPopupCallback } from "widget/wifi/PasswordPopup"

export const NetworkToggle = () => ArrowToggleButton({
    name: "network",
    icon: wifi.bind("icon_name"),
    label: wifi.bind("ssid").as(ssid => `${ssid}` || "Not Connected"),
    tooltipText: wifi.bind("ssid").as(ssid => `${ssid}` || "Not connected"),
    connection: [wifi, () => wifi.enabled],
    deactivate: () => wifi.enabled = false,
    activate: () => {
        wifi.enabled = true
        wifi.scan()
    },
})

export const WifiSelection = () => Menu({
    name: "network",
    icon: wifi.bind("icon_name"),
    title: "Wifi Selection",
    content: [
        Widget.Box({
            vertical: true,
            setup: self => self.hook(wifi, () => self.children =
                wifi.access_points
                    .sort((a, b) => b.strength - a.strength)
                    .slice(0, 10)
                    .map(ap => Widget.Button({
                        on_clicked: () => {
                            passwordPopupLabel.setValue(`Enter password for ${ap.ssid}`)
                            passwordPopupCallback.fn = (password) => {
                              Utils.execAsync(`nmcli device wifi connect ${ap.bssid} password "${password}"`)
                              // TODO: connect using nmcli c up ssid if the password is already set (check using nmcli c show)
                            }
                            if (dependencies("nmcli"))
                                App.openWindow("passwordPopup");
                        },
                        child: Widget.Box({
                            children: [
                                Widget.Icon(ap.iconName),
                                Widget.Label(ap.ssid || ""),
                                Widget.Icon({
                                    icon: icons.ui.tick,
                                    hexpand: true,
                                    hpack: "end",
                                    setup: self => Utils.idle(() => {
                                        if (!self.is_destroyed) // TODO: add bookmark icon to saved networks
                                            self.visible = ap.active
                                    }),
                                }),
                            ],
                        }),
                    })),
            ),
        }),
        Widget.Separator(),
        Widget.Button({
            on_clicked: () => {
        //TODO: widget that shows connected network's settings
            },
            child: Widget.Box({
                children: [
                    Widget.Icon(icons.ui.settings),
                    Widget.Label("Network"),
                ],
            }),
        }),
    ],
})
