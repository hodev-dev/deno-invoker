class CommandRegister {
  _commands: Array<any> = [];
  add(command: any) {
    this._commands = command;
  }
  listen() {
    const commandName: string = Deno.args[0];
    const find = this._commands.find((command) => {
      const [invoker] = command;
      return invoker._name === commandName;
    });
    const [invoker, fire, testArray] = find;
    let guard: boolean = true;
    const next = testArray.map((handler: any, index: number) => {
      const test = handler();
      if (guard) {
        let res = test();
        guard = res;
        return res;
      } else {
        return false;
      }
    });
    if (!next.includes(false) && !next.includes(undefined)) {
      fire();
    }
  }
}

export default CommandRegister;
