import express from 'express'
import { readFileSync } from 'fs'
var app = express()
var bodyParser = require('body-parser');
var _ = require('lodash')

app.use(bodyParser.urlencoded({ extended: false }));

app.set('view engine', 'ejs');

app.get('/', function(req, res, next) {
    let rawdata = readFileSync('data.json')  
    let users = JSON.parse(rawdata)

    let result_users = users.map(user=>{

      return {
          name: `${user.first_name} ${user.last_name}`,
          gender: `${user.gender === "Male" ? "Male":"FeMale"}`,
          age: user.age,
          tel: `Mobile ${user.tel.mobile}, Home ${user.tel.home}, Office ${user.tel.office}`
      }
  })
  console.log(result_users)
    let users_str = JSON.stringify(result_users)
    res.render('index',{user: users_str});
  });

app.post('/test/submit', function(req, res, next){
    let rawdata = readFileSync('data.json')  
    let users = JSON.parse(rawdata)
    
    let id = req.body.id;

    let result_users = users.map(user=>{

        return {
            name: `${user.first_name} ${user.last_name}`,
            gender: `${user.gender === "Male" ? "Male":"FeMale"}`,
            age: user.age,
            tel: `Mobile ${user.tel.mobile}, Home ${user.tel.home}, Office ${user.tel.office}`
        }
    })
    
    function searchByText(collection, text) {
        return _.filter(collection,  _.partial(
            _.some, _,
            _.flow(_.toLower, _.partial(_.includes, _, _.toLower(text), 0))
          ))
      }
    
    let isMale = (result_users) => result_users.gender === "Male"
    
    if(_.toLower(id)==='male'){
      let result = result_users.filter(user=>isMale(user))
      let users_str = JSON.stringify(result)
      res.render('test',{output: users_str})
    }else if(_.toLower(id)==='female'){
      let result = result_users.filter(user=>!isMale(user))
      let users_str = JSON.stringify(result)
      res.render('test',{output: users_str})
    }else{
      let result = searchByText(result_users, id)
      let users_str = JSON.stringify(result)
      res.render('test',{output: users_str})
    }
})

app.listen(3000, () => console.log('app listening on port 3000!'))