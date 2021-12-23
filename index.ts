import {Invoker, Command} from "./export.ts";

const invoker = new Invoker();

const helper = new Command(Deno.args)
    .name("helper")
    .argument("arg1")
    .option("-i", "--id")
    .sequence(function* tasks() {
        yield async (data: any, next: Function, reject: Function) => {
            const id = data.parse.options.id[0];
            return next({"id": id});
        };
        yield async (data: any, next: Function, reject: Function) => {
            const {prev} = data.response;
            const jsonResponse = await fetch(`https://jsonplaceholder.typicode.com/todos/${prev.id}`);
            const jsonData = await jsonResponse.json();
            return next({json: jsonData});
        };
        yield async (data: any, next: Function, reject: Function) => {
            const {prev} = data.response;
            return reject({error: "Something Wrong"});
        };
    }).catch((err: any) => {
        const {error} = err.data;
        console.log(error);
    }).finally((data: any) => {
        console.log(data);
    });

invoker.register([helper]);
await invoker.run();
