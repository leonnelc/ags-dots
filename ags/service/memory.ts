import { dependencies } from "lib/utils";

class MemoryService extends Service {
  static {
    Service.register(this, {
        "percent": ["int"],
        "usage": ["string"],
        "available": ["boolean"],
    }, {
        "percent": ["int", "r"],
        "usage": ["string", "r"],
        "available": ["boolean", "r"],
        "is_polling": ["boolean", "r"],
    });
  }
  private cmd = `free -ms 1`;
  private _available = false;
  private _percent = 0;
  private _usage = "0/0";
  private _proc;
  private _is_polling = false;
  #dependency_check = dependencies("free");
  get is_polling() {
    return this._is_polling;
  }
  private parseOutput(output: string) {
    const line = output.replace(/\s+/g, " ").split(" ")
    if (line.length != 7 || line[0] != "Mem:") {
        return {total:-1, used:-1}
    }
    const [total, used] = line.slice(1)
    return {total:parseInt(total), used:parseInt(used)}
  }
  public stop_polling() {
    if (!this._is_polling) return;
    this._proc.force_exit();
    this._is_polling = false;
    this._available = false;
    this.notify("is_polling")
    this.emit("available", this.available)
    this.notify("available")
  }
  public start_polling() {
    if (this._is_polling) return;
    if (!this.#dependency_check) {
      console.warn(`Binary 'free' not found, memory indicator will be disabled.`)
      return;
    }
    this._is_polling = true;
    this.notify("is_polling")
    return (this._proc = Utils.subprocess(
      // command to run, in an array just like execAsync
      ["bash", "-c", this.cmd],
      // callback when the program outputs something to stdout
      (output) => {
        const parsedOutput = this.parseOutput(output);
        if (parsedOutput.total == -1) {
            return
        }
        const newPercent = Math.round(parsedOutput.used/parsedOutput.total * 100)
        const newUsage = (`${parsedOutput.used}/${parsedOutput.total}`);
        if (newPercent !== this._percent) {
            this._percent = newPercent;
            this.emit("percent", this.percent);
            this.notify("percent");
        }
        if (newUsage !== this._usage) {
            this._usage = newUsage;
            this.emit("usage", this.usage);
            this.notify("usage");
        }
        if (!this._available) {
            this._available = true;
            this.emit("available", this.available);
            this.notify("available");
        }
      },

      // callback on error
      (err) => logError(err),
    ));
  }

  get percent() {
    return this._percent;
  }
  get usage() {
    return this._usage;
  }
  get available() {
    return this._available;
  }
  constructor() {
    super();
  }
}
const service = new MemoryService();
export default service;
