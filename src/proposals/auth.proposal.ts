import { main } from './main.proposal';

/*
 * Authentication in a application
 * root: auth
 */
export namespace auth {
  /**
   * Flags used in module to explain interactions
   */
  export namespace flag {
    /**
     * Error codes in module
     */
    export namespace error {
      /**
       * User was not found when a login was attempted
       */
      export const NO_USER_FOUND = 'No user was found';
      /**
       * User allready exists when one was trying to be created
       */
      export const USER_EXISTS = 'User already exists';
      /**
       * No valid auth information provided
       */
      export const NO_VALID_AUTH = 'The auth information is not valid';
    }
  }
  /**
   * Datatypes used for authentication
   */
  export namespace types {
    /**
     * Usermeta describing a user
     */
    export type UserMeta = {
      /**
       * Can contain all sorts of keys with meta data
       */
      [meta: string]: any,
      /**
       * Identifier of user is used to identify user
       */
      id?: string
    }
    /**
     * Identifier of a active signed in session
     */
    export type SessionId = any;
    /**
     * User account identifier
     */
    export type AccountId = any;
  }
  /**
   * Contets of the packet field in request
   */
  export namespace packages {
    /**
     * Existing meta data to match if a user already exist and new meta data
     */
    export type SignUp = {
      // only for ts no meta exist
      [key: string]: any;
      /**
       * Existing metadata to verify do not exist on a user
       */
      existing: types.UserMeta,
      /**
       * Meta to be used in a creation of a user
       */
      meta: types.UserMeta
    }
    /**
     * Usermeta to be used for identification of a user
     */
    export type SignIn = types.UserMeta;
    /**
     * Validate a user sessions
     */
    export type Validate = {
      session: types.SessionId;
    }
    /**
     * Session id to be destroyed
     */
    export type SignOut = {
      session: types.SessionId
    }
    /**
     * Identifier of what acount to remove
     */
    export type Remove = {
      account: types.AccountId;
    }
    /**
     * Patch of new meta and the target account
     */
    export type Patch = {
      // only for ts no meta exist
      [key: string]: any;
      /**
       * Accout of user
       */
      user: types.AccountId,
      /**
       * The key with values to be patched
       */
      meta: types.UserMeta
    }
  }
  /**
   * Expected returns from auth operations
   */
  export namespace Returns {
    /**
     * Give back an account identifier
     */
    export type SignUp = types.AccountId;
    /**
     * Passes the session
     */
    export type SignIn = types.SessionId;
    /**
     * Validated account id belonning to session
     */
    export type Validate = types.AccountId;
    /**
     * Success of operation
     */
    export type SignOut = Boolean;
    /**
     * Success of operation
     */
    export type Remove = Boolean;
    /**
     * Success of operation
     */
    export type Patch = Boolean;
  }

  export interface Proposal {
    /**
     * Sign up a user if a specfic query is not met
     */
    signUp: main.types.MicroService
    /**
     * Sign in the specified user
     */
    signIn: main.types.MicroService
    /**
     * Sign out specific user session
     */
    signOut: main.types.MicroService
    /**
     * Removes a specfic user account from the system
     */
    remove: main.types.MicroService
    /**
     * Patch a user account with updated meta
     */
    patch: main.types.MicroService
    /**
     * Validate a session
     */
    validate: main.types.MicroService
  }
}