import { singleQuery, multiQuery } from '../db';
import {
  UserInterface,
  SearchUserParam,
  UserRegisterData
} from '../interfaces/user';

export default class User {
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

  static async searchUser(params: SearchUserParam):Promise<{ userList?: Array<UserInterface>, error?: string }> {
    const { searchText } = params;
    const _searchText = `%${searchText.toLowerCase()}%`;
    const { rows, error } = await multiQuery(`
      select ${User.userDbKeys.join(',')}
      from users u
      where u.deleted = false
      and u.id != ${params.userId}
      and (lower(u.name) like '${_searchText}'
      or lower(u.lastname) like '${_searchText}'
      or lower(u.login) like '${searchText}')
    `);
    if (error) return { error }
    return { userList: rows }
  }

  static async registerUser(params: UserRegisterData): Promise<{ userid?: number, error?: string }> {
    const { row, error } : { row?: { id: number }, error?: string } = await singleQuery(`
      insert into users (name, login, password)
      values ($1, $2, crypt($3, gen_salt('bf', 8)))
      returning id
    `, [params.name, params.login, params.password]);
    if (error) return { error }

    return { userid: row?.id }
  }
}
