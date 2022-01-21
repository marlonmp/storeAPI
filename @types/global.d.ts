import { QueryResult } from 'pg';

declare global {

    // Globals

    type error = Error | null;
    
    // db/*.js

    type QueryRes = QueryResult<any> | null;

    type Exec = (query: string, args: any[]) => { err: error, res: QueryRes };
}
