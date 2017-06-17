import { resolver, main } from './proposals';
import { Observable, Observer } from 'rxjs';

/**
 * Implemented registry with microservices
 */
export class ServiceRegistry {
    /**
     * Microservices implemented
     */
    private services: main.types.Services = {};
    /**
     * Hooks implemented
     */
    private hooks: main.types.Hooks = {
        pre: [],
        post: []
    };
    /**
     * Non local resolvers of microservice acts
     * TODO: THis is not used yet
     */
    public resolvers: Array<any> = [];
    /**
     * Adds an microservice on a specific root performing a certain operation and give that a name
     */
    addMicroService(root: string, name: string, service: main.types.MicroService): void {

        // check if root exists otherwise add it
        if (this.services[root] === undefined) {
            this.services[root] = {};
        }

        // check if name exist otherwise add it
        if (this.services[root][name] === undefined) {
            // add service to list of services
            this.services[root][name] = service;
        } else {
            throw new Error(main.flag.error.NAME_ON_ROOT_EXISTS);
        }
    }
    /**
     * Adds a pre hook to microservice
     */
    addPreHook(root: string, name: string, hook: main.types.Hook<main.types.Request>): void {

        // add the hook to stack
        this.hooks.pre.push({
            root: root,
            name: name,
            hook: hook
        });
    }
    /**
     * Adds a post hook to microservice
     */
    addPostHook(root: string, name: string, hook: main.types.Hook<main.types.Response>): void {

        /// add the hook to stack
        this.hooks.post.push({
            root: root,
            name: name,
            hook: hook
        });
    }
    /**
     * Do the microservice pre hook
     */
    doPreHook(root: string, name: string, payload: main.types.Request): main.types.Request {

        // loop the hooks
        for (let source of this.hooks.pre) {

            // check match for root
            if (source.root.match(root)) {

                // then check match for name
                if (source.name.match(name)) {
                    payload = source.hook(payload);
                }
            }
        }

        return payload;
    }
    /**
    * Do the microservice post hook
    */
    doPostHook(root: string, name: string, payload: main.types.Response): main.types.Response {

        // loop the hooks
        for (let source of this.hooks.post) {

            // check match for root
            if (source.root.match(root)) {

                // then check match for name
                if (source.name.match(name)) {
                    payload = source.hook(payload);
                }
            }
        }

        return payload;
    }
    /**
     * Act out the microservice based upon the request
     */
    act(root: string, name: string, request: main.types.Request): main.types.Response {

        // init empty handlers as undefined
        let metaHandler: Observer<any> = undefined;
        let packageHandler: Observer<any> = undefined;

        // keep track of number of nexts
        let nextCounter = 0;

        // add the root and name metas
        request._meta = {
            msName: name,
            msRoot: root
        };

        // prepare function to be run when observable is finished
        let next = () => {

            // count handlers up
            nextCounter++;

            // check that handlers are populated
            if (nextCounter === 2) {

                // use the handlers to perform the main service
                this.services[root][name](request, metaHandler, packageHandler);

                // check if root exists otherwise add it
                if (this.services[root] === undefined) {
                    packageHandler.error(new Error(main.flag.error.NO_ROOT_FOUND));
                    packageHandler.complete();
                    metaHandler.complete();
                } else {
                    // check if name exists otherwise add it
                    if (this.services[root][name] === undefined) {
                        packageHandler.error(new Error(main.flag.error.NO_NAME_ON_ROOT));
                        packageHandler.complete();
                        metaHandler.complete();
                    } else {

                        // perform the pre hooks
                        request = this.doPreHook(root, name, request);

                        // test
                        request.package.subscribe(null, (err) => {
                            packageHandler.error(err);
                            packageHandler.complete();
                            metaHandler.complete();
                        });
                    }
                }
            }
        }

        // generate response to make the handlers
        let response: main.types.Response = {
            meta: Observable.create((innerHandler: any) => {
                metaHandler = innerHandler;
                next();
            }),
            package: Observable.create((innerHandler: any) => {
                packageHandler = innerHandler;
                next();
            })
        }

        // perform the post hooks
        response = this.doPostHook(root, name, response);

        // return the final response
        return response;
    }
}
