import IOptions from "../types/Command.ts";
import args = Deno.args;

class Invoker {
    _args: Array<String> = [""];
    _name: string = "";
    _options: Array<IOptions> = [];
    _argument: Array<any> = [];
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
    argument(...name: Array<String>) {
        this._argument = [...name];
        return this;
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
    parseArgument(){
        let temp: any = {};
        const parse = this._args.slice(this._args.indexOf(this._name) +1 ,this.getFlags()[0].index);
        parse.forEach((arg,index) => {
            let obj: any = {};
            const key = this._argument[index];
               if(key !== undefined){
                   temp[key] = arg;
               }
        });
        return temp;
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
        const args = this.parseArgument();
        const fire = () => {
            callback(args,options);
        };
        return [this, fire];
    }
}

export default Invoker;
