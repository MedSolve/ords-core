import { Resolver, Main } from './proposals';
import { Observable, Observer } from 'rxjs';

/**
 * Implemented registry with microservices
 */
export class ServiceRegistry {
    /**
     * Microservices
     */
    public services: Main.Types.Services = {};
    /**
     * Hooks
     */
    public hooks: Main.Types.Hooks = {};
    /**
     * Non local resolvers of microservice acts
     */
    public resolvers: Array<Resolver.Proposal> = [];
    /**
     * Adds an microservice on a specific root performing a certain operation and give that a name
     */
    addMicroService(root: string, name: string, service: Main.Types.MicroService): void {

        // check if root exists otherwise add it
        if (this.services[root] === undefined) {
            this.services[root] = {};
        }

        // check if name exist otherwise add it
        if (this.services[root][name] === undefined) {
            // add service to list of services
            this.services[root][name] = service;
        } else {
            throw new Error(Main.Flag.Error.NAME_ON_ROOT_EXISTS);
        }
    }
    /**
     * Adds a pre hook to microservice
     */
    addPreHook(root: string, name: string, hook: Main.Types.Hook<Main.Types.Request>): void {

        // check if root exists otherwise add it
        if (this.hooks[root] === undefined) {
            this.hooks[root] = {};
        }

        // check if name exists otherwise add it
        if (this.hooks[root][name] === undefined) {
            this.hooks[root][name] = {
                pre: [],
                post: []
            }
        }

        // add the hook to correct type
        this.hooks[root][name].pre.push(hook);
    }
    /**
     * Adds a post hook to microservice
     */
    addPostHook(root: string, name: string, hook: Main.Types.Hook<Main.Types.Response>): void {

        // check if root exists otherwise add it
        if (this.hooks[root] === undefined) {
            this.hooks[root] = {};
        }

        // check if name exists otherwise add it
        if (this.hooks[root][name] === undefined) {
            this.hooks[root][name] = {
                pre: [],
                post: []
            }
        }

        // add the hook to correct type
        this.hooks[root][name].post.push(hook);
    }
    /**
     * Do the microservice pre hook
     */
    doPreHook(root: string, name: string, payload: Main.Types.Request): void {

        // | I.Hook<Response>

        // check if hooks exists
        if (this.hooks[root] === undefined ||
            this.hooks[root][name] === undefined) {
            return;
            // else perform hook
        } else {

            // loop hooks and fire them with the payload
            for (let hook of this.hooks[root][name]['pre']) {
                hook(payload);
            }
        }
    }
    /**
    * Do the microservice post hook
    */
    doPostHook(root: string, name: string, payload: Main.Types.Response): void {

        // | I.Hook<Response>

        // check if hooks exists
        if (this.hooks[root] === undefined ||
            this.hooks[root][name] === undefined) {
            return;
            // else perform hook
        } else {

            // loop hooks and fire them with the payload
            for (let hook of this.hooks[root][name]['post']) {
                hook(payload);
            }
        }
    }
    /**
     * Act out the microservice based upon the request
     */
    act(root: string, name: string, request: Main.Types.Request): Main.Types.Response {

        // check if root exists otherwise add it
        if (this.services[root] === undefined) {
            throw new Error(Main.Flag.Error.NO_ROOT_FOUND);
        } else {
            // check if name exists otherwise add it
            if (this.services[root][name] === undefined) {
                throw new Error(Main.Flag.Error.NO_NAME_ON_ROOT);
            } else {

                // perform the pre hooks
                this.doPreHook(root, name, request);

                // init empty handlers as undefined
                let metaHandler: Observer<any> = undefined;
                let packageHandler: Observer<any> = undefined;

                // keep track of number of nexts
                let nextCounter = 0;

                // prepare function to be run when observable is finished
                let next = () => {

                    // count handlers up
                    nextCounter++;

                    // check that handlers are populated
                    if (nextCounter === 2) {

                        // use the handlers to perform the main service
                        this.services[root][name](request, metaHandler, packageHandler);
                    }
                }

                // generate response to make the handlers
                let Response: Main.Types.Response = {
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
                this.doPostHook(root, name, Response);

                // return the final response
                return Response;
            }
        }
    }
}
