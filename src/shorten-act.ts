import { ServiceRegistry } from './service-registry';
import { Main } from './proposals';

export interface TryCatchHandler {
    (err: Error, res?: any, meta?: any): void
}

export class ShortenAct {
    /**
     * Convert body output from act depending on the meta flag set
     */
    public static convertOutput(body: Main.Packages, flag: any): any {

        switch (flag) {
            case Main.Flag.DataType.RAW:
                return body['0'];
            case Main.Flag.DataType.MULTIPLE:
                // return in sorted array
                return Object.keys(body).map((key: string) => {
                    return body[key];
                });
            case Main.Flag.DataType.OBJECT:
                return body;
            default:
                return body;
        }
    }
    /**
     * Perform try catch on acting
     */
    public static tryCatch(registry: ServiceRegistry, root: string, name: string, request: Main.Types.Request, handler: TryCatchHandler): void {

        // try to perform action
        let errFlag: boolean = false;

        try {

            // setup holder
            let body: any = {};
            let meta: any = {};

            // flag indicating send
            let done: boolean = false;

            // operation flag
            let flag: string = Main.Flag.DataType.RAW;

            // carry out operation and send back results
            let resp = registry.act(root, name, request);

            // subscribe to body
            resp.package.subscribe(
                value => {
                    body[value[0]] = value[1];
                },
                err => {
                    if (errFlag === false) {
                        handler(err);
                        errFlag = true;
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
                    if (value[0] === Main.Flag.FLAGSEND) {
                        flag = value[1];
                    } else {
                        meta[value[0]] = value[1];
                    }
                },
                err => {
                    if (errFlag === false) {
                        handler(err);
                        errFlag = true;
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

            // catch any error
        } catch (err) {

            if (errFlag === false) {
                handler(err);
                errFlag = true;
            }
        }
    }
}