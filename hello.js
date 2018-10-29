import express from 'express'
import { readFileSync } from 'fs'
var app = express()
var bodyParser = require('body-parser');
var _ = require('lodash')

let rawdata = readFileSync('data.json')  
let users = JSON.parse(rawdata)

let result_users = users.map(user=>{

  return {
      id: `${user.id}`,
      name: `${user.first_name} ${user.last_name}`,
      gender: `${user.gender === "Male" ? "Male":"FeMale"}`,
      age: user.age,
      tel: `Mobile ${user.tel.mobile}, Home ${user.tel.home}, Office ${user.tel.office}`
  }
})


app.use(bodyParser.urlencoded({ extended: false }));

app.set('view engine', 'ejs');

app.get('/', function(req, res, next) {
    let users_str = JSON.stringify(users)
    //console.log()
    res.render('index',{user: result_users});
  });

app.post('/test/submit', function(req, res, next){
    let id = req.body.id;
    
    function searchByText(collection, text) {
        return _.filter(collection,  _.partial(
            _.some, _,
            _.flow(_.toLower, _.partial(_.includes, _, _.toLower(text), 0))
          ))
      }
    
    let isMale = (result_users) => result_users.gender === "Male"
    
    if(_.toLower(id)==='male'){
      let result = result_users.filter(user=>isMale(user))
      
      res.render('test',{output: result})
    }else if(_.toLower(id)==='female'){
      let result = result_users.filter(user=>!isMale(user))
      
      res.render('test',{output: result})
    }else{
      let result = searchByText(result_users, id)
      
      res.render('test',{output: result})
    }
})

app.listen(3000, () => console.log('app listening on port 3000!'))