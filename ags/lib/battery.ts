import icons from "./icons"
import options from "options"
export default async function init() {
    const bat = await Service.import("battery")
    const { low, veryLow, enableBatteryControl } = options.bar.battery;
    let { percent:prevPercent, charged: wasCharged, charging: wasCharging } = bat;
    const sleepCountDown = () => {
      if (!enableBatteryControl.value  || bat.charging || bat.percent > veryLow.value) return;
      let countDown = 10;
        let interval = setInterval( () => {
          if (!enableBatteryControl.value || bat.charging || bat.percent > veryLow.value) {
            return clearInterval(interval);
          }
          if (countDown == 0) {
              clearInterval(interval);
              Utils.notify({summary: "Goodbye!", transient:true, timeout: 1000});
              return setTimeout(() => {Utils.exec(options.powermenu.sleep.value)}, 1500);
          }
          Utils.notify({summary:"Critical battery level",
            body:`Sleeping in ${countDown--} seconds`,
            timeout: 1750,
            transient: true,
            soundName: "dialog-error",
          })
        }, 1000)
    }

    bat.connect("changed", ({ percent, charging, charged }) => {
        if (!enableBatteryControl.value) return
        if (wasCharging !== charging || wasCharged !== charged) {
          if (charged) {
            Utils.notify({
              summary: "Battery fully charged",
              body: "Battery fully charged, you can disconnect the charger.",
              iconName: icons.battery.charged,
              timeout: 2500,
              transient: true,
          })
      } else {
        Utils.notify({
            summary: `${charging ? "Battery Charging" : "Battery Discharging"}`,
            iconName: `battery-level-${Math.trunc(Math.trunc(percent / 10)*10)}${charging ? "-charging" : ""}-symbolic`,
            timeout: 2500,
            transient: true,
            soundName: charging ? "power-plug" : "power-unplug",
          })
        }
      }
        wasCharging = charging;
        wasCharged = charged;
        if (prevPercent === percent) {
          return
        } else {
          prevPercent = percent;
        }

        if (percent > low.value || charging || charged)
            return
        
        if (percent > veryLow.value) {
            Utils.notify({
                summary: `${percent}% Battery Percentage`,
                body: "Low battery level, connect the charger.",
                iconName: icons.battery.critical,
                timeout: 5000,
                transient: true,
                soundName: "dialog-error",
            })
            return
        }
            Utils.notify({
                summary: `Battery level critical`,
                body: "Battery level is too low, sleeping soon.",
                iconName: icons.battery.critical,
                timeout: 5000,
                transient: true,
                soundName: "dialog-error",
            })
            sleepCountDown()
    })
}
