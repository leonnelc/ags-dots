
class CpuService extends Service {
  static {
    Service.register(this,
       {
        "percent": ["int"],
        "available": ["boolean"],
       },
       {
        "percent": ["int", "r"],
        "available": ["boolean", "r"],
        "is_polling": ["boolean", "r"],
       });
  }
  private _available = false;
  private _prev = {idle:0, nonIdle:0, total:0}
  #percent = 0;
  private _percent = Variable(0, {poll: 
    [1500, () => {
      const newPercent = this.getCpuPercent();
      if (newPercent !== this.#percent) {
        this.#percent = newPercent;
        this.emit("percent", this.percent);
        this.notify("percent");
      }
      return this.#percent;
    }]
  })

  private getCpuPercent() {
    const stat = Utils.readFile('/proc/stat').split("\n")
    const cpustat = stat[0].split(/\s+/g).slice(1)
    const [user, nice, system, idle, iowait, irq, softirq, steal, guest, guest_nice] = cpustat
    const idleTotal = parseInt(idle)+parseInt(iowait??0)
    const nonIdleTotal = parseInt(user) + parseInt(nice) + parseInt(system) + parseInt(irq??0) + parseInt(softirq??0) + parseInt(steal??0) + parseInt(guest??0) + parseInt(guest_nice??0)
    const total = idleTotal + nonIdleTotal;
    const totald = total - (this._prev.total);
    const idled = idleTotal - (this._prev.idle);
    const cpu_percent_perc = Math.round(((totald - idled) / totald) * 100);
    this._prev.idle = idleTotal;
    this._prev.nonIdle = nonIdleTotal;
    this._prev.total = total;
    if (totald == total && idled == idleTotal) {
      if (this._available) {
        this._available = false;
        this.emit("available", this.available);
        this.notify("available");
      }
      return 0;
    }
    if (!this._available) {
      this._available = true;
      this.emit("available", this.available)
      this.notify("available")
    }
    return cpu_percent_perc;
  }
  get is_polling() {
    return this._percent.is_polling;
  }
  public stop_polling() {
    if (!this._percent.is_polling) return;
    this._percent.stopPoll();
    this.notify("is_polling");
    this._prev.total = 0
    this._prev.idle = 0
  }
  public start_polling() {
    if (this._percent.is_polling) return;
    this._percent.startPoll();
    this.notify("is_polling");
  }
  get percent() {
    return this.#percent;
  }
  get available() {
    return this._available;
  }
  constructor() {
    super();
  }
}
const service = new CpuService();
export default service;
