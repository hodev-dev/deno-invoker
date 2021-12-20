class CommandRegister {
    _commands: Array<any> = [];
    add(command: any) {
        this._commands = command;
    }
    listen() {
        const commandName: string = Deno.args[0];
        const find = this._commands.some((command) => {
            const [invoker, fire] = command;
            return invoker._name === commandName;
        });
        if (find === true) {
            this._commands.forEach((command) => {
                const [invoker, fire] = command;
                if (invoker._name === commandName) {
                    fire();
                }
            });
        } else {
            console.log("command not found");
        }
    }
}

export default CommandRegister;
