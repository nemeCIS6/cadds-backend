import locationDatabase from '../db/locationDatabase';
import LocationCreateModel from '../../models/location/LocationCreateModel';
import LocationModel from '../../models/location/LocationModel';


class locationService {

    async createAsync(model:LocationCreateModel):Promise<LocationModel|false>{
      let id = await locationDatabase.createAsync(model);
      if(id){
          return new LocationModel(
              id,model.longitude,model.latitude,model.street,model.city,model.name
          )
      }
      return false;
    }

}

const ls = new locationService();
export default ls;