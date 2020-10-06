/// <reference types="node" />

declare module "snowflake-sdk" {
  export enum ocspModes {
    FAIL_CLOSED = "FAIL_CLOSED",
    FAIL_OPEN = "FAIL_OPEN",
    INSECURE = "INSECURE"
  }

  export interface Options {
    account: string;
    username: string;
    password: string;
    database?: string;
    schema?: string;
    warehouse?: string;
    role?: string;
    clientSessionKeepAlive?: boolean;
    clientSessionKeepAliveHeartbeatFrequency?: number;
    jsTreatIntegerAsBigInt?: boolean;
    /** @deprecated */
    region?: string;
  }

  export interface Statement {
    getSqlText(): string;
    cancel(fn: (err: Error, stmt: Statement) => void): void;
  }

  export type Bind = string | number;
  export type Binds = Bind[] | Bind[][];

  export type Connection = NodeJS.EventEmitter & {
    /**
     * Make session tokens available for testing
     */
    getTokens(): unknown;

    /**
     * Returns true if the connection is active otherwise false
     */
    isUp(): boolean;

    getServiceName(): string;
    getClientSessionKeepAlive(): boolean;
    getClientSessionKeepAliveHeartbeatFrequency(): number;
    getJsTreatIntegerAsBigInt(): boolean;

    /**
     * Returns the connection id.
     */
    getId(): string;

    heartbeat(): void;

    /**
     * Establishes a connection if we aren't in a fatal state.
     */
    connect(fn: (err: Error, conn: Connection) => void): void;

    /**
     * Executes a statement.
     */
    execute<Row extends any>(options: {
      sqlText: string;
      binds?: Binds;
      complete: (err: Error, stmt: Statement, rows: Row[]) => void;
    }): void;

    /**
     * Fetches the result of a previously issued statement.
     */
    fetchResult<T extends any>(): T;

    /**
     * Immediately terminates the connection without waiting for
     * currently executing statements to complete.
     */
    destroy(fn: (err: Error, conn: Connection) => void): void;

    /**
     * Returns a serialized version of this connection.
     */
    serialize(): string;
  };

  /**
   * Creates a new Connection instance.
   */
  export function createConnection(options: Options): Connection;

  /**
   * Deserializes a serialized connection.
   */
  export function deserializeConnection(
    options: Options,
    serializedConnection: string
  ): Connection;

  /**
   * Serializes a given connection.
   */
  export function serializeConnection(connection: Connection): string;

  export type LogTags = "ERROR" | "WARN" | "INFO" | "DEBUG" | "TRACE";

  export interface ConfigureOptions {
    logLevel?: LogTags;
    insecureConnect?: boolean;
    ocspFailOpen?: boolean;
  }

  /**
   * Configures this instance of the Snowflake core module.
   */
  export function configure(options?: ConfigureOptions): void;

  export const STRING = "STRING";
  export const BOOLEAN = "BOOLEAN";
  export const NUMBER = "NUMBER";
  export const DATE = "DATE";
  export const JSON = "JSON";
}
