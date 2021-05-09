import clientDatabase from '../db/clientDatabase';
import ClientCreateModel from '../../models/client/ClientCreateModel';
import ClientModel from '../../models/client/ClientModel';


class clientService {

    async createAsync(model:ClientCreateModel):Promise<ClientModel|false>{
      let id = await clientDatabase.createAsync(model);
      if(id){
          return new ClientModel(
              id,model.email,model.name,model.address,model.phone
          )
      }
      return false;
    }

}

const ls = new clientService();
export default ls;