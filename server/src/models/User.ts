import { singleQuery } from '../db';

export interface UserInterface {
  id: number,
  name?: string,
  lastname?: string,
  deleted?: boolean,
  created_at?: string,
  updated_at?: string
}

const userDbKeys = [
  'u.id',
  'u.name',
  'u.lastname',
  'u.deleted',
  'u.created_at',
  'u.updated_at'
];

export class User implements UserInterface {
  id: number;
  name?: string;
  lastname?: string;
  deleted?: boolean;
  created_at?: string;
  updated_at?: string;

  constructor(id:number, name?:string, lastname?:string, deleted?:boolean, created_at?:string, updated_at?:string) {
    this.id = id;
    this.name = name;
    this.lastname = lastname;
    this.deleted = deleted;
    this.created_at = created_at;
    this.updated_at = updated_at;
  }

  static async authUser(login:string, password: string):Promise<User | { error: string }> {
    if (!login || !password) { return { error: 'Login or password not found' } }

    const query = `
      select
        ${userDbKeys.join(',')}
      from users u
      where u.password = crypt(${password}, u.password)
      and u.login = ${login}
      and deleted = false
    `;

    const { error, row } = await singleQuery(query);
    if (error) {
      return { error }
    }
    
    return new User(row.id, row.name, row.lastname, row.deleted, row.created_at, row.updated_at);
  }

  static async getUserById(id:number):Promise<{ user?: UserInterface,  error?: string }> {
    const query = `
      select
        ${userDbKeys.join(',')}
      from users u
      where u.id = $
    `;
    const { error, row } = await singleQuery(query, [id]);
    if (error) {
      return { error }
    }

    return { user: row };
  }
}
