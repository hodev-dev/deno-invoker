import useSequence from "./sequence.ts";

const sequence: any = useSequence();

class Invoker {
    _commands: Array<any> = [];
    _store: Array<any> = [];

    register(command: any) {
        this._commands = command;
    }
    async run(){
        const commandName: string = Deno.args[0];
        const selectedCommand = this._commands.find((invoker) => {
            return invoker._name === commandName;
        });
        if(selectedCommand){
            return await sequence.runSync(selectedCommand._tasks,selectedCommand._catch, selectedCommand);
        }else{
            console.log('command not found!');
        }
    }
}

export default Invoker;
