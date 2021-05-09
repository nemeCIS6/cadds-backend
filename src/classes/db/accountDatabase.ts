"use strict";
import IUserRole from "../../interfaces/account/IUserRole";
import IUserType from "../../interfaces/account/IUserType";
import UserCreateModel from "../../models/account/UserCreateModel";
import db from "../mysqlDatabase";
import IDatabaseReturnType from "../../interfaces/common/IDateBaseReturnType";
import IDatabaseRow from "../../interfaces/common/IDateBaseRow";
import IExistingUser from "../../interfaces/account/IExistingUser";
import IUserSession from "../../interfaces/account/IUserSession";
import ILocation from "../../interfaces/location/ILocation";
const settings = require("../../settings");

const mysql = require("mysql");
const log = require("../log");
/**
 *
 *
 * @class accountDatabase
 */
class accountDatabase {
  async getAsync(id: number): Promise<IDatabaseRow | null | false> {
    try {
      let result = await db.queryAsync(
        "SELECT `uid` AS `id`,`first_name`,`last_name`,`email`,`role` as `role_id`, `position`, UNIX_TIMESTAMP(`registered`) AS `registered` FROM `users` WHERE `uid` = ? LIMIT 1",
        [id]
      );
      return result && result.length > 0 ? result[0] : null;
    } catch (e) {
      log.error(e);
      return false;
    }
  }

  async listAsync(skip: number = 0, take: number = 25) {
    let query = "SELECT `uid` AS `id`,`first_name`,`last_name`,`email`,`role` as `role_id`,`position`,  UNIX_TIMESTAMP(`registered`) AS `registered` FROM `users`  ORDER BY  `users`.`registered` ASC ";
    let binders: Array<string | number> = [];
    if (take >= 0) {
      query += "LIMIT ?,?"
      binders = [...binders, skip, take];
    }
    try {
      let result = await db.queryAsync(
        query,
        binders
      );
      return result || [];
    } catch (e) {
      log.error(e);
      return false;
    }
  }

  async getListTotalsAsync(): Promise<number> {
    let query = `SELECT count(\`users\`.\`uid\`) AS \`count\` FROM \`users\``;
    try {
      const result = await db.queryAsync(query);
      return result ? parseInt(result[0].count) : 0;
    } catch (e) {
      log.error(e);
      return 0;
    }
  }

  async activateAsync(userId: number, activationTime?: Date): Promise<boolean> {
    if (!activationTime) {
      activationTime = new Date();
    }
    try {
      let query = "UPDATE `users` SET `activated` = FROM_UNIXTIME(?) WHERE `uid` = ? AND `activated` IS NULL";
      let result = await db.queryAsync(query, [Math.round(activationTime.getTime() * .001), userId])
      return result && result.affectedRows > 0;
    }
    catch (e) {
      log.error(e);
      return false;
    }
  }

  async logActivationMessageAsync(userId: number, date?: Date) {
    if (!date) {
      date = new Date();
    }
    try {
      let result = await db.queryAsync(
        "INSERT INTO `user_activations` (`user`,`sent`) VALUES(?, FROM_UNIXTIME(?))",
        [userId, Math.round(date.getTime() * .001)]
      );
      return result && result.insertId ? result.insertId : false;
    }
    catch (e) {
      log.error(e);
      return false;
    }
  }

  async getLastActivationMessageAsync(userId: number): Promise<Date | null | false> {
    try {
      let result = await db.queryAsync("SELECT UNIX_TIMESTAMP(`sent`) AS `sent` FROM `user_activations` WHERE `user` = ? ORDER BY `sent` DESC LIMIT 0,1", [userId]);
      return result && result.length > 0 ? new Date(result[0].sent / .001) : null;
    }
    catch (e) {
      log.error(e);
      return false;
    }
  }

  public async getLastPasswordResetDateAsync(userId: number): Promise<Date | null | false> {
    try {
      let result = await db.queryAsync("SELECT UNIX_TIMESTAMP(`sent`) AS `sent` FROM `user_password_resets` WHERE `user` = ? ORDER BY `sent` DESC LIMIT 0,1", [userId]);
      return result && result.length > 0 ? new Date(result[0].sent / .001) : null;
    }
    catch (e) {
      log.error(e);
      return false;
    }
  }

  public async createPasswordResetAsync(userId: number) {
    try {

      let date = new Date();
      date = new Date(Math.round(date.getTime() * .001) * 1000)

      const result = await db.queryAsync("INSERT INTO `user_password_resets` (`user`, `sent`) VALUES(?, FROM_UNIXTIME(?))", [userId, Math.round(date.getTime() * .001)]);
      return result && result.insertId > 0 ? date : null;
    }
    catch (e) {
      log.error(e);
      return false;
    }
  }

  public async updatePasswordAsync(userId: number, passwordHash: string) {
    try {
      const result = await db.queryAsync("UPDATE `users` SET `password` = UNHEX(?) WHERE `uid` = ?", [passwordHash, userId]);
      if (result && result.affectedRows) {
        return true;
      }
      return null;
    }
    catch (e) {
      log.error(e);
      return false;
    }
  }

  async authorizeAsync(email: string, passwordHash: string) {
    try {
      let result = await db.queryAsync(
        "SELECT `uid` AS `id`,`first_name`,`last_name`,`email`,`role` as `role_id`, `position`, UNIX_TIMESTAMP(`registered`) AS `registered` FROM `users` WHERE `email` = ? AND `password` = UNHEX(?) LIMIT 1",
        [email, passwordHash]
      );
      return result.length ? result[0] : null;
    } catch (e) {
      log.error(e);
      return false;
    }
  }

  async createSessionAsync(userId: number, sessionId: string, location?: ILocation, pushNotificationTokenId?: number) {
    const validity = settings.session.validity || 30;
    let columns = [`session_id`,`user`,`valid_until`]
    let inserts = ["UNHEX(?)", "?" , "NOW() + INTERVAL ? DAY " ];
    let binders =  [sessionId, userId, validity];
    let query = '';
    
    if(pushNotificationTokenId){
      columns.push('push_token');
      inserts.push(' ? ');
      binders.push(pushNotificationTokenId);
      query+= ' , `push_token` = VALUES(`push_token`) ';
    }
/*     if(location){
      columns.push(`last_location`);
      inserts.push(' POINT(?,?) ');
      binders.push(location.longitude,location.latitude);
      query+= ' , `last_location`= VALUES(`last_location`) ';
    } */
    query =  `INSERT INTO \`sessions\` ( ${columns.map(i => `\`${i}\``).join(' , ')} ) VALUES( ${inserts.join(' , ')} ) ` +
     "ON DUPLICATE KEY UPDATE \
                  `session_id` = VALUES(`session_id`), \
                  `started` = NOW(), \
                  `valid_until` = VALUES(`valid_until`) " + query;

    try {
      let result = await db.queryAsync(query,binders);
      return result.insertId;
    } catch (e) {
      log.error(e);
      return false;
    }
  }

  async savePushNotificationTokenAsync(token: string) {
    let query = "INSERT INTO `push_tokens` (`token`) VALUES(?) ON DUPLICATE KEY UPDATE `token` = VALUES(`token`) ";
    try {
      let result = await db.queryAsync(query,[token]);
      return result.insertId;
    } catch (e) {
      log.error(e);
      return false;
    }
  }

  async getPushNotificationTokenByToken(token:string){
    let query = "SELECT `uid` AS `id`, `token` FROM `push_tokens` WHERE `token` = ? LIMIT 1";
    try {
      let result = await db.queryAsync(query,[token]);
      return  result && result.length > 0 ? result[0] : null;
    } catch (e) {
      log.error(e);
      return false;
    }
  }

  async createAccountAsync(model: UserCreateModel): Promise<number | false> {
    try {
      let query =
        "INSERT INTO `users` (`email`,`password`,`first_name`,`last_name`,`role`,`position`)  VALUES(?, UNHEX(?), ? , ? , ?, ?)";

      let binders: Array<string | number> = [
        model.email,
        model.passwordHash,
        model.firstName,
        model.lastName,
        model.role.id,
        model.position
      ];

      let sql = mysql.format(query, binders);
      let result = await db.queryAsync(sql);
      return result.insertId ? result.insertId : false;
    } catch (e) {
      log.error(e);
      return false;
    }
  }

  async userExistsAsync(email: string): Promise<boolean> {
    try {
      const sql = mysql.format(
        "SELECT COUNT(`email`) AS `c` FROM `users` WHERE `email` = ?",
        [email]
      );
      const result = await db.queryAsync(sql);
      return parseInt(result[0].c) !== 0;
    } catch (e) {
      log.error(e);
      return true;
    }
  }

  async getByEmailAsync(email: string) {
    try {
      let result = await db.queryAsync(
        "SELECT `uid` AS `id`,`first_name`,`last_name`,`email`,`role` as `role_id`, `position`, UNIX_TIMESTAMP(`registered`) AS `registered` FROM `users` WHERE `email` = ?  LIMIT 1",
        [email]
      );
      return result.length ? result[0] : null;
    } catch (e) {
      log.error(e);
      return false;
    }
  }

  async invalidateSessionAsync(sessionId: string) {
    try {
      const result = await db.queryAsync(
        "UPDATE `sessions` SET `valid_until` = NOW() WHERE `session_id` = UNHEX(?)",
        [sessionId]
      );
      return result.affectedRows;
    } catch (e) {
      log.error(e);
      return false;
    }
  }

  async getRolesAsync(): Promise<IUserRole[]> {
    try {
      const result = await db.queryAsync(
        "SELECT `uid`,`name` FROM `user_roles`"
      );
      return result && result.length > 0
        ? result.map(
          (row: any): IUserRole => {
            return { id: parseInt(row.uid), name: row.name };
          }
        )
        : [];
    } catch (e) {
      log.error(e);
    }
    return [];
  }

  async patchAsync(
    id: number,
    firstName: string | false,
    lastName: string | false,
    roleId: number | false,
    email: string | false,
    password: string | false,
    birthday: Date | false
  ): Promise<number | false> {
    let query = "UPDATE `users` SET ";
    let setters = [];
    let binders = [];

    if (firstName) setters.push(" `first_name` = ? ") && binders.push(firstName);
    if (lastName) setters.push(" `last_name` = ? ") && binders.push(lastName);
    if (roleId) setters.push(" `role` = ? ") && binders.push(roleId);
    if (email) setters.push(" `email` = ? ") && binders.push(email);
    if (password) setters.push(" `password` = UNHEX( ? ) ") && binders.push(password);
    if (birthday) setters.push(" `birthday` = ? ") && binders.push(birthday);

    query += setters.join(" , ") + " WHERE `uid` = ?";
    binders.push(id);

    try {
      const result = await db.queryAsync(query, binders);
      return result.affectedRows;
    } catch (e) {
      log.error(e);
      return false;
    }
  }

  async updateSessionAsync(sessionId:number, location?:ILocation){
    const validity = settings.session.validity || 30;
    let sets = ["`valid_until`= NOW() + INTERVAL ? DAY "];
    let values = [validity];
    if(location){
      sets.push('`last_location` =  POINT(?,?) ');
      values.push(location.longitude,location.latitude);
    }

    values.push(sessionId);
    const query = `UPDATE \`sessions\` SET ${sets.join(' , ')} WHERE \`uid\` = ?`;
    try{
     await db.queryAsync(query,values);
     return true;
    }
    catch(e){
      log.error(e);
      return false;
    }

  }

  async getSessionAsync(identifier:number, identifierType:'uid'|'userId',  getInactive?:boolean): Promise<any>
  async getSessionAsync(identifier:string, identifierType:'sessionId',  getInactive?:boolean): Promise<any> 
  async getSessionAsync(identifier:string|number, identifierType:'sessionId'|'uid'|'userId' = 'sessionId',  getInactive = false): Promise<any> {
      let where = [];
      switch(identifierType){
        case 'uid':
          where.push('`sessions`.`uid`= ?');
          break;
        case 'userId':
          where.push('`sessions`.`user` =  ?');
          break;
        case 'sessionId': 
        default: 
          where.push('`sessions`.`session_id` = UNHEX(?)');
          break;
      }
      let binders = [identifier];
      let selects = [
        '`sessions`.`uid` AS `uid`', 'HEX(`sessions`.`session_id`) AS `session_id`',
        'UNIX_TIMESTAMP(`sessions`.`started`) AS `started`','UNIX_TIMESTAMP(`sessions`.`valid_until`) AS `valid_until`','`sessions`.`user`',
        'UNIX_TIMESTAMP(`users`.`registered`) AS `registered`','`users`.`email`','`users`.`first_name`','`users`.`last_name`','`users`.`role` as `role_id`' ,
/*         '`push_tokens`.`token` AS `push_token`', */
      ];
      if(!getInactive){
        where.push("`sessions`.`valid_until` >= NOW()")
      }
/*       const query = `
          SELECT ${selects.join(' , ')} FROM \`sessions\` 
          LEFT JOIN \`users\` ON \`sessions\`.\`user\` = \`users\`.\`uid\`
          LEFT JOIN \`push_tokens\` ON \`push_tokens\`.\`uid\` = \`sessions\`.\`push_token\`
          ${where.length > 0 ? " WHERE " + where.join(' AND ') : ''}
          LIMIT 1
      `; */
      const query = `
      SELECT ${selects.join(' , ')} FROM \`sessions\` 
      LEFT JOIN \`users\` ON \`sessions\`.\`user\` = \`users\`.\`uid\`
      ${where.length > 0 ? " WHERE " + where.join(' AND ') : ''}
      LIMIT 1
  `;
      try {
      const result = await db.queryAsync(
        query,
        binders
      );
      return result && result.length ? result[0] : null;
    } catch (e) {
      log.error(e);
      return null;
    }
  }
}
let ad = new accountDatabase();
export default ad;
