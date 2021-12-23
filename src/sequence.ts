let useSequence = () => {
    async function runSync(_sequence: any, _catch: any, command: any) {
        const nextFactory = (data: any) => {
            return {status: true, data: data}
        };
        const rejectFactory = (data: any) => {
            return {status: false, data: data}
        };
        const seq: any = _sequence();
        let next;
        const resolve: any = [];
        let prev: any;
        let guard: boolean = true;
        let current: any;
        while (!(next = seq.next()).done) {
            if (guard) {
                const data = {
                    parse: {
                        arguments: command._parsedArguments,
                        options: command._parsedOptions,
                        unexpectedArgument: command._unexpectedArgument,
                        unexpectedOptions: command.testOptions()
                    },
                    response: {
                        prev,
                        stack: resolve,
                    }
                };
                current = data;
                const response: any = await next.value(data, nextFactory, rejectFactory);
                resolve.push(response);
                prev = response;
                guard = response.status;
                if (response.status === false) {
                    _catch(prev);
                    break;
                }
            }
        }
        command._finally(current);
        return current;
    }

    async function runByIndex(sequence: any, index: any) {
        const seq: any = sequence();
        var next: any;
        for (var i = 0; i <= index; ++i) {
            next = seq.next();
            if (next.done === false) {
                if (i === index) {
                    return await next.value();
                }
            } else {
                throw 'Out Of Range';
            }
        }
    }

    return {
        runSync,
        runByIndex,
    };
};

export default useSequence;
