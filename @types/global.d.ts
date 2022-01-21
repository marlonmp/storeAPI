import { QueryResult } from 'pg';

declare global {

    // Globals

    type error = Error | null;

    interface JSONObject {
        [key: string]: any
    }
    
    // db/*.js

    type QueryRes = QueryResult<any> | null;

    type Exec = (query: string, args: any[]) => { err: error, res: QueryRes };

    // model/*.js

    type Product = {
        id: number,
    
        name: string,
        description: string,
    
        price: number,
        sales: number,
    };
}
