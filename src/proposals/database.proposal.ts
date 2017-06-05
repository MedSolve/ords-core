import { Main } from './main.proposal';

/**
 * Proposal for Database
 * root: db
 */
export namespace Database {
    /**
     * Types used in proposals
     */
    export namespace Types {
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
        }

        export interface Create extends _base {
            // new data
            data: Types.Doc
            // query to check
            query?: Types.Query
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
            joins?: { [element: string]: Read }
            /**
             * Query to be performed
             */
            query?: Types.Query
        }
        export interface Update extends _base {
            // MongoDB like query syntax
            query: Types.Query
            // new data
            data: Types.Doc
        }
        export interface Patch extends _base {
            // MongoDB like query syntax
            query: Types.Query
            // new data
            data: Types.Doc
        }
        export interface Delete extends _base {
            // MongoDB like query syntax
            query: Types.Query
        }

    }
    /**
     * Returned from the operations in proposal
     */
    export namespace Returns {
        /**
         * Create operations return the inserted row id
         */
        export type Create = Types.RowId;
        /**
         * Read operations returned an array of documents
         */
        export type Read = Array<Types.Doc>;
        /**
         * Update operations return the effected row id
         */
        export type Update = Types.RowId;
        /**
         * Patch operations return the effected row id
         */
        export type Patch = Types.RowId;
        /**
         * Delete operations return the number of affected rows
         */
        export type Delete = Types.NumAffected;
    }
    /**
     * Operations included in proposal
     */
    export interface Proposal {
        /**
         * 
         */
        read: Main.Types.MicroService
        /**
         * 
         */
        create: Main.Types.MicroService
        /**
         * 
         */
        update: Main.Types.MicroService
        /**
         * 
         */
        delete: Main.Types.MicroService
        /**
         * 
         */
        patch: Main.Types.MicroService
    }
}