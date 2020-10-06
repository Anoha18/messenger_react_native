import { singleQuery } from '../db';

export interface UserInterface {
  id: number,
  login: string,
  name?: string,
  lastname?: string,
  deleted?: boolean,
  created_date?: string,
  created_time?: string,
  updated_date?: string,
  updated_time?: string,
}

export class User {
  static userDbKeys = [
    'u.id',
    'u.name',
    'u.lastname',
    'u.deleted',
    'u.login',
    `to_char(u.created_at, 'DD.MM.YYYY') created_date`,
    `to_char(u.created_at, 'HH24:MI') created_time`,
    `to_char(u.updated_at, 'HH24:MI') updated_time`,
    `to_char(u.updated_at, 'DD.MM.YYYY') updated_date`,
  ];

  static async authUser(login:string, password: string):Promise<{ user?: UserInterface, error?: string }> {
    if (!login || !password) { return { error: 'Login or password not found' } }

    const query = `
      select
        ${User.userDbKeys.join(',')}
      from users u
      where u.password = crypt('${password}', u.password)
      and u.login = '${login}'
      and deleted = false
    `;

    const { error, row } = await singleQuery(query);
    if (error) {
      return { error }
    }
    
    return { user: row };
  }

  static async getUserById(id:number):Promise<{ user?: UserInterface,  error?: string }> {
    const query = `
      select
        ${User.userDbKeys.join(',')}
      from users u
      where u.id = $1
    `;
    const { error, row } = await singleQuery(query, [id]);
    if (error) {
      return { error }
    }

    return { user: row };
  }
}
