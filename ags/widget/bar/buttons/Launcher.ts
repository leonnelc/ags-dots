import PanelButton from "../PanelButton"
import options from "options"

const { icon, label, action } = options.bar.launcher

function Spinner() {
    const child = Widget.Icon({
        icon: icon.icon.bind(),
        class_name: 
            icon.colored.bind().as(c => `${c ? "colored" : ""}`),
        css: `
            @keyframes spin {
                to { -gtk-icon-transform: rotate(1turn); }
            }

            image.spinning {
                animation-name: spin;
                animation-duration: 1s;
                animation-timing-function: linear;
                animation-iteration-count: infinite;
            }
        `,
    })

    return Widget.Revealer({
        transition: "slide_left",
        child,
        reveal_child: icon.icon.bind().as(i => Boolean(i)),
    })
}

export default () => PanelButton({
    window: "launcher",
    on_clicked: action.bind(),
    child: Widget.Box([
        Spinner(),
        Widget.Label({
            class_name: label.colored.bind().as(c => c ? "colored" : ""),
            visible: label.label.bind().as(v => !!v),
            label: label.label.bind(),
        }),
    ]),
})
