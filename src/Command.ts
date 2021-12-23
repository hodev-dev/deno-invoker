import IOptions from "../types/CommandInterface.ts";


class Command {
    _args: Array<String> = [""];
    _name: string = "";
    _options: Array<IOptions> = [];
    _rawOption: Array<String> = [];
    _argument: Array<any> = [];
    _allFlags: Array<any> = [];
    _parsedOptions: Array<any> | undefined = undefined;
    _parsedArguments: Array<any> = [];
    _unexpectedArgument: Array<any> = [];
    _handleTest: Array<Function> = [];
    _finally: any;
    _next: any = [];
    _tasks: any;
    _catch: any;

    constructor(args: Array<String>) {
        this._args = args;
    }

    name(name: string) {
        this._name = name;
        return this;
    }

    option(flag: string, long_flag: string) {
        this._options.push({flag, named_flag: long_flag});
        this._rawOption.push(flag);
        this._rawOption.push(long_flag);
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
                flags.push({name: arg, index});
            }
        });
        return flags;
    }

    normalizeNamedFlag(namedFlag: string) {
        return namedFlag.substring(namedFlag.indexOf("-") + 2);
    }

    sequence(tasks: Function) {
        this._parsedOptions = this.parseOptions();
        this._parsedArguments = this.parseArgument();
        this._tasks = tasks;
        return this;
    }

    testOptions() {
        return this._args.filter((arg: String) => !this._rawOption.includes(arg) && arg.includes("-"));
    }

    parseArgument() {
        let temp: any = {};
        const parse = this._args.slice(
            this._args.indexOf(this._name) + 1,
            this.getFlags()[0].index,
        );
        parse.forEach((arg, index) => {
            let obj: any = {};
            const key = this._argument[index];
            if (key !== undefined) {
                temp[key] = arg;
            } else {
                this._unexpectedArgument.push(arg);
            }
        });
        return temp;
    }

    parseOptions() {
        const flags = this.getFlags();
        this._allFlags = flags;
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

    catch(callback: Function) {
        const cb = async (data: any) => {
            callback(data);
        }
        this._catch = cb;
        return this;
    }

    finally(callback: Function) {
        this._finally =  (data: any) => {
            callback(data);
        }
        return this;
    }
}

export default Command;
