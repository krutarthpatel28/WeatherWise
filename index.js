import express from 'express';
import bodyParser from 'body-parser';
const app = express();

app.set('view engine', 'ejs')
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));


app.get("/",(req, res)=>{
    res.render("home");
});
// var data={};
// function collect_data(req, res, next){
//     var city = req.body.city;
//     data = {city:city};
//     next();
// };

// app.post('/weather', collect_data, (req,res)=>{
//     res.render('index', {data});
// });

app.listen(3000,()=>{
    console.log("Server's up and running .");
});