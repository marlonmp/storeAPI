import { FieldDef } from 'pg';

declare global {

    // Globals

    interface JSONObject {
        [key: string]: any
    }
    
    // db/*.js

    type Exec = (query: string, args: any[]) => { err: Error, command: string, fields: FieldDef[], oid: number, rowCount: number, rows: any[] };

    // model/*.js

    type Product = {
        id: number,
    
        name: string,
        description: string,
    
        price: number,
        sales: number,
    };
    
    type User = {
        id: number,
        role: number,
    
        firstName: String,
        lastName: String,
    
        email: String,
        password: String
    }
}
