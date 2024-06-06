import express, { Request, Response } from "express";
const bodyParser = require('body-parser');




const app = express()
const port = 3000


app.use(express.json());

app.get('/', (req: Request, res: Response) => {
    res.send('Hello world @@@@@@ Have a great day');
});

// Return all users

type Readings = {
    units : number,
    time : string;
}
type Meters = {
    meterId : number,
    name: string,
    readings: Readings[];
}
//================Task-1========================================================

const users: any[] = [];
const providers: any[] = [];
app.get('/users', (req: Request, res: Response) => {
    res.json(users);
});

// Create a user with attributes username, password, email and fullname
app.post('/users', (req: Request, res: Response) => {
     const user= {
        id: req.body.id,
        username: req.body.username,
        password: req.body.password,
        email: req.body.email,
        fullName: req.body.fullName,
    }
    users.push(user);
   // console.log(users);
    res.send("user created");
   // console.log(req.body);
   // res.send('hello')
    // use req.body
});

// Return a user with parameter id if not exists return message saying `user not found`
app.get('/users/:id', (req: Request, res: Response) => {
     const id= req.params.id
     const user= users.find((item: any) => item.id === id);
     console.log(user);
     res.json(user);

});


// update user information for given id 
app.put('/users/:id', (req, res) => {
    // req.params.id
    const id: string= req.params.id
    let Index = users.findIndex((item)=> item.id === id)
    //const  { username, password, email, fullName } = req.body;
    if(Index === -1){
        res.status(404).send("user not found");
        return;
    }
    else{
       
        users[Index] = {...users[Index], ...req.body};
       // users= {...users, ...user};
    }
    res.json(users);


});


// delete user for given id
app.delete('/users/:id', (req, res) => {
    // req.params.id
    const id: string= req.params.id
    const index: number = users.findIndex((item)=> item.id === id)
    if(index != -1){
        users.splice(index, 1);
        return;
    }
    else{
        res.json("user not found");
    }
});

//============================#####====Task-2=====###======================================
app.get('/providers', (req: Request, res: Response) => {
    res.json(providers);

});
app.post('/providers', (req: Request, res: Response) => {
  
    const provider= {
        id: req.body.id,
        name: req.body.name,
        charge: req.body.charge
    }
    providers.push(provider);
    res.send("provider created");
   // console.log(req.body);
   // res.send('hello')
    // use req.body
});

app.put('/providers/:id', (req, res) => {
    // req.params.id
    const id: number= parseInt(req.params.id);
    let index = providers.findIndex((item)=> item.id === id)
    //const  { username, password, email, fullName } = req.body;
    if(index === -1){
        res.status(404).send("provider not found");
        return;
    }
    else{
       
        providers[index] = {...providers[index], ...req.body};
       // users= {...users, ...user};
    }
    res.json(providers);


});

app.delete('/providers/:id', (req, res) => {
    // req.params.id
    const id: string= req.params.id
    const index: number = providers.findIndex((item)=> item.id === id)
    if(index != -1){
        users.splice(index, 1);
        return;
    }
    else{
        res.json("provider not found");
    }
});
//=======================####Task-3######=================================
app.put('/Providersubscription/:id' , (req: Request, res: Response) => {
    const userid= req.params.id;
    const providerId = req.body.provider;
    //console.log(providerId);

    const userIndex= users.findIndex((item) => item.id === userid);
    const providerIndex = providers.findIndex((item) => item.id === parseInt(providerId));
   // console.log(providerIndex);
    if(userIndex == -1){
        res.status(404).send("user not found");
        return;
    }
    else if(providerIndex != -1){
        console.log("succesfully subscribed");
        users[userIndex] = {...users[userIndex], ...req.body};
        
    }
    else{
        res.status(404).send("provider not found");
        return;
    }

    res.json(users);
      
});

//=====================####=========Task-4==============#================================
let meters: Meters[] = [];

app.get('/meters', (req: Request, res: Response) => {
    res.send(meters);
});

app.post('/meters', (req: Request, res: Response) => {
    
   const meter: Meters ={
       meterId : req.body.meterId,
       name : req.body.name,
       readings : []
   }
   meters.push(meter);
   console.log("meter created!");
    res.json(meters);

});
// API to store meter readings.
app.put('/meters/:id', (req: Request, res: Response) =>{
    
    const id: number= parseInt(req.params.id)
    const index: number = meters.findIndex((item)=> item.meterId === id)
    if(index === -1){
        res.status(404).send("meter not found");
        return;
    }
    else{
        const readings : Readings ={
            units: req.body.units,
            time: req.body.time
        }
       meters[index].readings.push(readings);
    }
    res.json(meters);
});

app.get('/meters/:id/readings', (req: Request, res: Response) =>{
    
    const id: number= parseInt(req.params.id)
    const index: number = meters.findIndex((item)=> item.meterId === id)
    res.send(meters[index].readings);
});
//============#########=======Task-5========$$$$$$$$$$========================================================================

app.put('/Metersubscription/:id', (req: Request, res: Response) => {
    const userid= req.params.id;
    const meterId = req.body.meterId;
    //console.log(providerId);

    const userIndex= users.findIndex((item) => item.id === userid);
    const meterIndex = providers.findIndex((item) => item.id === parseInt(meterId));
    console.log(userIndex);
    console.log(meterIndex);
    if(userIndex === -1 || meterIndex === -1){
        res.status(404).send("user and meter not found");
    }
    else{
        if(users[userIndex].hasOwnProperty('provider')){
            console.log("meter assigned to user");
           users[userIndex] = {...users[userIndex], ...req.body};
        }
        else{
            res.status(404).send("user is not subscribed to provider");
        }
   }
   res.json(users);
});

app.get('/users/:id/readings', (req: Request, res: Response) => {
    const userid= req.params.id;
    console.log(userid);
    const userIndex= users.findIndex((item) => item.id === userid);
    if(userIndex === -1){
        res.status(404).send("user not found");
        return;
    }
    const meterId = users[userIndex].meterId;
    const meterIndex = meters.findIndex((item) => item.meterId === parseInt(meterId));
    res.send(meters[meterIndex].readings);
    res.json(meters[meterIndex].readings);
    console.log("readings retrieved succesfully");
});

app.get('/users/totalbill/:id', (req: Request, res: Response)=> {
    const userid= req.params.id;
    console.log(userid);
    const userIndex= users.findIndex((item) => item.id === userid);
    if(userIndex === -1){
        res.status(404).send("user not found");
        return;
    }
    
    let totalUnits: number;
    let chargePerUnit: number;
    if(users[userIndex].hasOwnProperty('provider')){
    const providerId = users[userIndex].provider;
    const providerIndex = providers.findIndex((item) => item.id === providerId);
     chargePerUnit = parseInt(providers[providerIndex].charge);
    
    console.log(chargePerUnit);

        if(users[userIndex].hasOwnProperty('meterId')){
           const meterId = users[userIndex].meterId;
           const meterIndex = meters.findIndex((item) => item.meterId === parseInt(meterId));
           totalUnits = meters[meterIndex].readings.reduce((sum, reading) => sum + reading.units, 0);
          console.log(totalUnits);
         }
         else{
            res.status(404).send("meter not associated with the user");
            return;
        }
    }
    else{
        res.status(404).send("User is not subscribed to provider");
        return;
    }
    const totalBill = totalUnits * chargePerUnit;

    const bill = {
        user_id : userid,
        amount : totalBill
    }
     res.json(bill);

});

app.listen(port, () => {
    console.log(`server is running on port http://localhost:${port}`)
})

// curl -X POST 'http://localhost:3000/users'  -H 'Content-Type: application/json'  -d '{"id": "1490", "username": "rekha", "password": "456", "email": "rekha@gmail.com", "fullName": "Rekha korepu"}'
// curl -X POST 'http://localhost:3000/users' \ -H 'Content-Type: application/json' \ -d '{"id": "1491", "username": "anush", "password": "123", "email": "anush@example.com", "fullName": "anush Kumar"}'
// curl -X PUT 'http://localhost:3000/users/1491' \ -H 'Content-Type: application/json' \ -d '{"username": "anush kumar", "email": "anushkorepu@gmail.com"}'
//  curl -X DELETE 'http://localhost:3000/users/1491' 
// curl -X POST 'http://localhost:3000/providers' \ 
// curl -X POST 'http://localhost:3000/providers' \ -H 'Content-Type: application/json' \ -d '{"id": 1, "name": "Electro", "charge": 5}' 
// curl -X PUT 'http://localhost:3000/providers/1' \ -H 'Content-Type: application/json' \ -d '{"name": "Electroo"}'  
// curl -X POST 'http://localhost:3000/meters'  -H 'Content-Type: application/json'  -d '{"meterId": "1", "name": "meter1"}'            
//  curl -X PUT 'http://localhost:3000/meters/1490' \ -H 'Content-Type: application/json' \ -d '{"meterId" : 1}'  

// curl -X PUT http://localhost:3000/meters/1  -H 'Content-Type: application/json'  -d '{"units": 5, "time": "2024-05-31T10:00:00.000Z"}'
// curl -X GET 'http://localhost:3000/users/gettotalbill/1490'
//  curl -X PUT 'http://localhost:3000/providers/assignMeter/1490'  -H 'Content-Type: application/json'  -d '{"meterId" : 1}' 
// curl -X PUT 'http://localhost:3000/subscribeToProvider/1490'  -H 'Content-Type: application/json'  -d '{"provider": 1}'
