import PopupWindow from "widget/PopupWindow"
const defaultLabel = "Enter password"
export const passwordPopupLabel = Variable(defaultLabel)
export const passwordPopupCallback = { fn : (password:string) => {} }
const passwordVisible = Variable(false)
// TODO: be able to open multiple password prompts at the same time
const hidePasswordButton = Widget.Button(
  {
    hpack: "end",
    vpack: "end",
    class_name: "hide-button",
    onClicked: () => { passwordVisible.setValue( !passwordVisible.value) },
    can_focus: false,
    child: Widget.Icon(
      {
        class_name: "hide-button-icon",
        icon: passwordVisible.bind().as( (val) => val ? "password-show-off" : "password-show-on" ),
        tooltipText: passwordVisible.bind().as( (val) => `${val ? "Hide" : "Show"} password`)
      }
    ),
  }
)
const passwordEntry = Widget.Entry(
  {
    hexpand: true,
    hpack: "fill",
    visibility: passwordVisible.bind(),
    class_name: "password-entry",
    setup: (self) => {
      self.connect("map", () => {
        self.grab_focus(); // grab focus and hide password when it's opened
      })
      self.connect("unmap", (self) => { // this runs when window is closed
        self.text = ""
        passwordVisible.setValue(false);
        passwordPopupLabel.setValue(defaultLabel)
        passwordPopupCallback.fn = (password:string) => {} // prevent callback from being reused
      })
    },
    onAccept: ({text}) => {
      passwordPopupCallback.fn(text ?? "")
      App.closeWindow("password-popup")
    },
  }
) 
const passwordInputBox = Widget.Box(
  {vertical: false, children: [passwordEntry, hidePasswordButton], hpack: "fill"})

export default () => PopupWindow({
  name: "password-popup",
  transition: "crossfade",
  child: Widget.Box({
    vertical: true,
    class_name: "verification",
    children: [
      Widget.Label({label: passwordPopupLabel.bind()}),
      passwordInputBox,
    ],
  })
})
