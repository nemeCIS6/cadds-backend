"use strict";

import db from '../mysqlDatabase';
const log = require("../log");

import LocationCreateModel from '../../models/location/LocationCreateModel';

class LocationDatabase {

  async createAsync(location: LocationCreateModel):Promise<number|false> {
    const query =
      "INSERT INTO `locations` (`user`,`location`,`accuracy`,`city`, `country`, `name`,`postal_code`,`region`, `street`) VALUES(?,POINT(?,?),?,?,?,?,?,?,?) ";
    try {
      const result = await db.queryAsync(query, [
        location.user.id,
        location.longitude,
        location.latitude,
        location.accuracy,
        location.city,
        location.country,
        location.name,
        location.postalCode,
        location.region,
        location.street
      ]);
      return result.insertId || 0;
    } catch (e) {
      log.error(e);
      return false;
    }
  }

}

export default new LocationDatabase();