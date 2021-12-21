import { CommandRegister, Invoker } from "./import.ts";

const register = new CommandRegister();

const helper = new Invoker(Deno.args)
    .name("helper")
  .argument("arg1")
  .option("-d", "--debug")
  .option("-s", "--silence")
  .option("-w", "--write")
  .option("-n", "--name")
  .run((args: any,options: any) => {
      console.log(args,options);
  });

const dev = new Invoker(Deno.args)
    .name("dev")
  .argument("source","dest")
    .option("-d", "--dev")
    .option("-s", "--slow")
  .run((args: any,options: any) => {
    console.log(args,options);
  });

register.add([helper, dev]);
register.listen();
