import { TContact, TLead, TUser } from "@/types";
import axios from "axios";


let origin = 'http://localhost:5001';



export const getLeads = async (query?: string) : Promise<TLead[]> => {
   try {
        
        let apiUrl = `${origin}/api/leads?with=contacts`


        console.log('Параметры getLeads', query);
        
        apiUrl += '&' + new URLSearchParams(query).toString();
        
        let respons = await axios(apiUrl);

        if (!respons.data._embedded) {
          return [];
        }

        return respons.data._embedded.leads;
   } catch (e) {
     console.log(e);
     
          throw(e)
   }
}



export const getContactByUrl = async (url: string) : Promise<TContact> => {
     console.log('ссылка', url);
     
     try {
          let respons = await axios(`${origin}/api/leads/contacts?contactUrl=${url}`);
          if (respons.statusText !== 'OK') {
 
  
              throw new Error('Ошибка запроса');
          }
        
          
          return respons.data;
     } catch (e) {
            throw(e)
     }
  }

  export const getUserById = async (id: number) : Promise<TUser> => {
     try {
          let respons = await axios(`${origin}/api/users/${id}`);
          if (respons.statusText !== 'OK') {
              throw new Error('Ошибка запроса');
          }
          return respons.data;
     } catch (e) {
            throw(e)
     }
  }




//   (async () => await getContactByUrl('https://evdoki15.amocrm.ru/api/v4/contacts/1354227?with=contacts&page=1&limit=250'))()