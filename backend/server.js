import express from 'express';
import cors from "cors";
import 'dotenv/config';
import bodyParser from 'express'
const app = express();

app.use(cors({
    credentials: true,
    origin: 'http://localhost:5173'
  }));
  
  app.use(express.json());
 app.use(bodyParser.urlencoded({
  extended: true
}));

  const port = process.env.PORT || 5000;



  

app.get('/api/leads', async(req, res) => {
    try {

        let queryParams = new URLSearchParams(req.query).toString();

        console.log('ПАРАМЕТРЫ', queryParams);

        let response  = await fetch(`https://${process.env.SUBDOMEN}.amocrm.ru/api/v4/leads?${queryParams}`, {
        headers: { Authorization: `Bearer ${process.env.ACCESS_TOKEN}`},
        });
        
        if (response.status === 204) {
            return res.status(200).send([]);
        }

        response = await response.json();

        return res.status(200).send(response)
    } catch (e) {
        return res.status(400).send({name: e.name, message: e.message})
    }
})



app.get('/api/users/:id', async(req, res) => {
    try {

        let {id} = req.params
        
        let response = await fetch(`https://${process.env.SUBDOMEN}.amocrm.ru/api/v4/users/${id}`, {
        headers: { Authorization: `Bearer ${process.env.ACCESS_TOKEN}`},
    });
        response = await response.json();
        return res.status(200).send(response)
    } catch (e) {
        return res.status(400).json({name: e.name, message: e.message})
    }
})


app.get('/api/leads/contacts', async(req, res) => {
    try {

        let { contactUrl } = req.query

        
        let response = await fetch(`${contactUrl}`, {
        headers: { Authorization: `Bearer ${process.env.ACCESS_TOKEN}`},
    });
        response = await response.json();

        return res.status(200).send(response)
    } catch (e) {
        return res.status(400).json({name: e.name, message: e.message})
    }
})



app.use((req, res) => {
    res.status(404).json({ error: 'Request error' });
});
  
app.listen(port, () => {
console.log(`Сервер запущен на порте ${port}`);
});

///api/v4/leads/pipelines/{pipeline_id}/statuses