import matugen from "./matugen"
import gtk from "./gtk"
import batteryWatcher from "./battery"
import notifications from "./notifications"

export default function init() {
    try {
        gtk()
        matugen()
        batteryWatcher()
        notifications()
    } catch (error) {
        logError(error)
    }
}
