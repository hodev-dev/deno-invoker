import { CommandRegister, Invoker } from "./import.ts";
const register = new CommandRegister();

const helper = new Invoker(Deno.args)
  .name("helper")
  .argument("arg1")
  .option("-d", "--debug")
  .option("-w", "--write")
  .option("-n", "--name")
  .then((optionError: string) => {
    console.log(optionError);
  })
  .finally((args: any, options: any) => {

  });

const dev = new Invoker(Deno.args)
  .name("dev")
  .argument("source", "dest", "last")
  .option("-d", "--dev")
  .option("-s", "--slow")
  .then((data: string, next: Function, reject: Function) => {
    console.log("first", data);
    return next();
  })
  .then((data: string, next: Function, reject: Function) => {
    console.log("second", data);
    return next();
  })
  .then((data: string, next: Function, reject: Function) => {
    console.log("third", data);
  })
  .finally((args: any, options: any) => {
    console.log("run");
  });

register.add([helper, dev]);
register.listen();
