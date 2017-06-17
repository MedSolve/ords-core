import { main } from './main.proposal';

/**
 * Proposal for Database
 * root: db
 */
export namespace database {
    /**
     * Types used in proposals
     */
    export namespace types {
        /**
         * Identifier of the row affected row
         */
        export type RowId = any;
        /**
         * Document in the database
         */
        export type Doc = { [key: string]: any };
        /**
         * Query for Other operations
         */
        export type Query = { [key: string]: any; }
        /**
         * Number of effected rows
         */
        export type NumAffected = number;

    }
    /**
     * Request packages for operations 
     */
    export namespace Packages {

        // not to be directly used
        export interface _base {
            [key: string]: any;
            resource: string;
            runValidations?: boolean;
        }

        export interface Create extends _base {
            // new data
            data: types.Doc
            // query to check
            query?: types.Query
        }
        export interface Read extends _base {
            /**
             * Limits the number of output in the read
             */
            limit?: number;
            /**
             * Specific elements from the resource
             */
            elements?: { [element: string]: Boolean; }
            /*
             * Sort results in query
             */
            sort?: [{ element: boolean }]
            /**
             * Join the results on specific element
             */
            joins?: {
                [originElement: string]: {      // the origin element to match with
                    targetResource: string,     // resource to perform query in
                    targetElement: string,      // element from which origin should match
                    scope: Read                 // scope of the query
                }
            }
            /**
             * Query to be performed
             */
            query?: types.Query
        }
        export interface Update extends _base {
            // MongoDB like query syntax
            query: types.Query
            // new data
            data: types.Doc
        }
        export interface Patch extends _base {
            // MongoDB like query syntax
            query: types.Query
            // new data
            data: types.Doc
        }
        export interface Delete extends _base {
            // MongoDB like query syntax
            query: types.Query
        }

    }
    /**
     * Returned from the operations in proposal
     */
    export namespace Returns {
        /**
         * Create operations return the inserted row id
         */
        export type Create = types.RowId;
        /**
         * Read operations returned an array of documents
         */
        export type Read = Array<types.Doc>;
        /**
         * Update operations return the effected row id
         */
        export type Update = types.RowId;
        /**
         * Patch operations return the effected row id
         */
        export type Patch = types.RowId;
        /**
         * Delete operations return the number of affected rows
         */
        export type Delete = types.NumAffected;
    }
    /**
     * Operations included in proposal
     */
    export interface Proposal {
        /**
         * 
         */
        read: main.types.MicroService
        /**
         * 
         */
        create: main.types.MicroService
        /**
         * 
         */
        update: main.types.MicroService
        /**
         * 
         */
        delete: main.types.MicroService
        /**
         * 
         */
        patch: main.types.MicroService
    }
}