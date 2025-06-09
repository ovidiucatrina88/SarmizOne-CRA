declare module 'passport-openidconnect' {
  import { Request } from 'express';
  import { Strategy as PassportStrategy } from 'passport';

  export interface Profile {
    id: string;
    displayName?: string;
    name?: {
      givenName?: string;
      familyName?: string;
    };
    emails?: Array<{ value: string }>;
    _json: any;
    _raw: string;
  }

  export interface StrategyOptions {
    issuer: string;
    authorizationURL: string;
    tokenURL: string;
    userInfoURL: string;
    clientID: string;
    clientSecret: string;
    callbackURL: string;
    scope?: string[];
    skipUserProfile?: boolean;
    passReqToCallback?: boolean;
  }

  export type VerifyCallback = (
    err: any,
    user?: any,
    info?: any
  ) => void;

  export type VerifyFunction = (
    issuer: string,
    profile: Profile,
    context: any,
    idToken: string,
    accessToken: string,
    refreshToken: string,
    done: VerifyCallback
  ) => void;

  export class Strategy extends PassportStrategy {
    constructor(options: StrategyOptions, verify: VerifyFunction);
    constructor(verify: VerifyFunction);
    authenticate(req: Request, options?: any): void;
    name: string;
  }
}