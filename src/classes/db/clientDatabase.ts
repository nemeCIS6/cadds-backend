"use strict";

import db from '../mysqlDatabase';
const log = require("../log");

import ClientCreateModel from '../../models/client/ClientCreateModel';
import IDatabaseRow from '../../interfaces/common/IDateBaseRow';

class ClientDatabase {


  async createAsync(client: ClientCreateModel):Promise<number|false> {
    const query =
      "INSERT INTO `clients` (`name`,`address`,`phone`, `email`) VALUES(?,?,?,?) ";
    try {
      const result = await db.queryAsync(query, [
        client.name,
        client.address,
        client.phone,
        client.email
      ]);
      return result.insertId || 0;
    } catch (e) {
      log.error(e);
      return false;
    }
  }

  async getAsync(id: number): Promise<IDatabaseRow | null | false> {
    try {
      let result = await db.queryAsync(
        "SELECT `uid` AS `id`,`name`,`address`,`email`,`phone` FROM `clients` WHERE `uid` = ? LIMIT 1",
        [id]
      );
      return result && result.length > 0 ? result[0] : null;
    } catch (e) {
      log.error(e);
      return false;
    }
  }
}

export default new ClientDatabase();