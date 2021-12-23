import {Invoker, Command} from "./export.ts";

const invoker = new Invoker();

const helper = new Command(Deno.args)
    .name("helper")
    .argument("arg1")
    .option("-i", "--id")
    .sequence(function* tasks() {
        yield async (data: any, next: Function, reject: Function) => {
            const {ID} = data.parse;
            return next({"id": ID});
        };
        yield async (data: any, next: Function, reject: Function) => {
            const {prev: id} = data.response;
            console.log(id);
            const jsonResponse = await fetch(`https://jsonplaceholder.typicode.com/todos/${id}`);
            const jsonData = await jsonResponse.json();
            return next({json: jsonData});
        };
        yield async (data: any, next: Function, reject: Function) => {
            const {prev} = data.response;
            console.log(prev);
            return next({});
        };
    }).catch((err: any) => {
        const { error } = err.data;
        console.log(error);
    }).finally((data: any) => {});

invoker.register([helper]);
await invoker.run();
