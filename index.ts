import { CommandRegister, Invoker } from "./import.ts";

const register = new CommandRegister();

const helper = new Invoker(Deno.args).name("helper")
  .argument("test")
  .option("-d", "--debug")
  .option("-s", "--silence")
  .option("-w", "--write")
  .option("-n", "--name")
  .run((options: any) => {
    console.log(options);
  });

const dev = new Invoker(Deno.args).name("dev")
  .argument("test")
  .option("-d", "--dev")
  .run((options: any) => {
    console.log(options);
  });

register.add([helper, dev]);
register.listen();
