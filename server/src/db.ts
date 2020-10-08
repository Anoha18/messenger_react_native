import { Pool } from 'pg';
import { DB } from './config';

const logger = (messages:any) => {
  console.log('PG POOL LOG: ', messages);
}

const pool:Pool = new Pool({
  database: DB.NAME,
  user: DB.USER,
  password: DB.PASSWORD,
  host: DB.HOST,
  port: DB.PORT,
  log: logger
});

interface ReturnTestConnection {
  error?: string,
  success: number
}

export const testConnection = async():Promise<ReturnTestConnection> => {
  try {
    await pool.connect();
    const query = `select 1 + 1 test_query`;
    const { rows } = await pool.query(query);
    if (!rows) {
      return { success: 0, error: 'Database connection failed. Error message: Test query filed' }
    }
    console.log('TEST QUERY RESULT: ', (rows[0] && rows[0].test_query) || null);
    console.log('Connection to data base success');
    return { success: 1 }
  } catch (error) {
    console.error(error);
    return { success: 0, error: error.message }
  }
}

interface ReturnMultuQuery {
  rows?: any[],
  error?: string
}

export const multiQuery = async(query:string, values?: Array<any>):Promise<ReturnMultuQuery> => {
  console.log(`\nMULTI QUERY: \n\t${query}\n`);
  if (values) {
    console.log(`\nVALUES: \t${values}`);
  }
  
  try {
    const { rows } = await pool.query(query, values);
    return { rows };
  } catch (error) {
    console.error(error);
    return { error: error.message }
  }
}

interface ReturnSingleQuery {
  row?: any,
  error?: string
}
export const singleQuery = async(query:string, values?: Array<any>):Promise<ReturnSingleQuery> => {
  console.log(`\nSINGLE QUERY: \n\t${query}\n`);
  if (values) {
    console.log(`\nVALUES: \t${values}`);
  }
  
  try {
    const { rows } = await pool.query(query, values);
    return { row: (rows && rows[0]) || null };
  } catch (error) {
    console.error(error);
    return { error: error.message }
  }
}