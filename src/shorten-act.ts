import { ServiceRegistry } from './service-registry';
import { main } from './proposals';

export interface TryCatchHandler {
    (err: Error, res?: any, meta?: any): void
}

export class ShortenAct {
    /**
     * Convert body output from act depending on the meta flag set
     */
    public static convertOutput(body: main.Packages, flag: any): any {

        switch (flag) {
            case main.flag.dataType.RAW:
                return body['0'];
            case main.flag.dataType.MULTIPLE:
                // return in sorted array
                return Object.keys(body).map((key: string) => {
                    return body[key];
                });
            case main.flag.dataType.OBJECT:
                return body;
            default:
                return body;
        }
    }
    /**
     * Perform try catch on acting
     */
    public static tryCatch(registry: ServiceRegistry, root: string, name: string, request: main.types.Request, handler: TryCatchHandler): void {

        // try to perform action
        let errflag: boolean = false;

        // setup holder
        let body: any = {};
        let meta: any = {};

        // flag indicating send
        let done: boolean = false;

        // operation flag
        let flag: string = main.flag.dataType.RAW;

        // carry out operation and send back results
        let resp = registry.act(root, name, request);

        // subscribe to body
        resp.package.subscribe(
            value => {
                body[value[0]] = value[1];
            },
            err => {
                if (errflag === false) {
                    handler(err);
                    errflag = true;
                }
            },
            () => {

                // send the response if done
                if (done) {
                    handler(null, ShortenAct.convertOutput(body, flag), meta);
                } else {

                    // set done flag to true
                    done = true;
                }
            }
        );

        // subscribe to headers
        resp.meta.subscribe(
            value => {
                // save flag if it is send
                if (value[0] === main.flag.FLAGSEND) {
                    flag = value[1];
                } else {
                    meta[value[0]] = value[1];
                }
            },
            err => {
                if (errflag === false) {
                    handler(err);
                    errflag = true;
                }
            },
            () => {

                // send the response if done
                if (done) {
                    handler(null, ShortenAct.convertOutput(body, flag), meta);
                }

                // set done flag to true
                done = true;
            }
        );
    }
}