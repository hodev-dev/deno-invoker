import IOptions from "../types/Command.ts";

class Invoker {
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
  constructor(args: Array<String>) {
    this._args = args;
  }
  name(name: string) {
    this._name = name;
    return this;
  }
  option(flag: string, long_flag: string) {
    this._options.push({ flag, named_flag: long_flag });
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
        flags.push({ name: arg, index });
      }
    });
    return flags;
  }
  normalizeNamedFlag(namedFlag: string) {
    return namedFlag.substring(namedFlag.indexOf("-") + 2);
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
  then(testCallback: Function) {
    const handleTest = () => {
      if (typeof this._parsedOptions !== "object") {
        this._parsedOptions = this.parseOptions();
      }
      if (this._parsedArguments.length === 0) {
        this._parsedArguments = this.parseArgument();
      }
      const next = () => {
        return true;
      };
      const reject = () => {
        return false;
      };
      const testOptions = this._args.filter((arg: String) =>
        !this._rawOption.includes(arg) && arg.includes("-")
      );
      const data = {
        unexpectedOptions: testOptions,
        unexpectedArgument: this._unexpectedArgument,
        options: this._parsedOptions,
        arguments: this._parsedArguments,
      };
      return () => testCallback(data, next, reject);
    };
    this._handleTest.push(handleTest);
    return this;
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
  finally(callback: Function) {
    const fire = () => {
      callback(this._parsedArguments, this.parseOptions());
    };
    return [this, fire, this._handleTest];
  }
}

export default Invoker;
