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
        const [,fire] = find;
        fire();
    }
}

export default CommandRegister;
