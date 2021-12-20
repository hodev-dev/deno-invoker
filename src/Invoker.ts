import IOptions from "../types/Command.ts";

class Invoker {
    _args: Array<String> = [""];
    _name: string = "";
    _options: Array<IOptions> = [];
    _argument: string = "";
    constructor(args: Array<String>) {
        this._args = args;
    }

    name(name: string) {
        this._name = name;
        return this;
    }
    option(flag: string, long_flag: string) {
        this._options.push({ flag, named_flag: long_flag });
        return this;
    }
    argument(name: string) {
        this._argument = name;
        return this;
    }
    log() {
        console.log(this);
    }
    getType(arg: String) {
        const isFlag = arg.includes("-");
        if (isFlag) {
            return "FLAG";
        }
        {
            return "ARG";
        }
    }
    getFlags() {
        const flags: any = [];
        this._args.forEach((arg, index) => {
            if (arg.includes("-")) {
                flags.push({ name: arg, index });
            }
        });
        return flags;
    }
    normalizeNamedFlag(namedFlag: string) {
        return namedFlag.substring(namedFlag.indexOf("-") + 2);
    }
    parseOptions() {
        const flags = this.getFlags();
        const temp: any = {};
        let iterator: number;
        flags.map((flag: { name: string; index: number }, cycle: number) => {
            if (cycle === flags.length - 1) {
                iterator = cycle;
            } else {
                iterator = cycle + 1;
            }
            this._options.map((option: any) => {
                if (option.flag == flag.name || option.named_flag == flag.name) {
                    if (flags[cycle + 1] !== undefined) {
                        temp[this.normalizeNamedFlag(option.named_flag)] = this._args.slice(
                            flag.index + 1,
                            flags[iterator].index,
                        );
                    } else {
                        temp[this.normalizeNamedFlag(option.named_flag)] = this._args.slice(
                            flag.index + 1,
                        );
                    }
                }
            });
        });
        return temp;
    }
    run(callback: Function) {
        const options = this.parseOptions();
        const fire = () => {
            callback(options);
        };
        return [this, fire];
    }
}

export default Invoker;
