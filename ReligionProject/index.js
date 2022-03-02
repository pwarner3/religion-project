const listenPort = 3333;
let express = require("express");
let path = require('path');
let app = express();
app.set("view engine","ejs");
app.use(express.static(path.join(__dirname, '/public')));//for images

app.use(express.urlencoded({extended: true}));//needed to POST and manipulate data

let knex = require("knex")({
    client: "pg",
    connection: {
        host: "localhost",
        server: "PostgreSQL 14",
        user: "postgres",
        password: "yesbaby",
        database: "postgres",
        port: 5432
    },
    useNullAsDefault: true
});

app.listen(listenPort, function() {console.log("Listener active on port " +
listenPort);});

var authUser = true;//to start on login page

app.get("/", function(req,res) //landing page
{ 
    if(authUser === true){
        knex('BookOfMormon').orderBy('bomID')//ordering
            .then(scripInfo=> {
                res.render("index",{scripData: scripInfo});
            }).catch(err => {
                console.log(err);
                res.status(500).json({err});
            });
        } else {
            res.redirect("/login");
        }
});

app.get("/addItems",(req,res) => {//display add page (read)
    if(authUser === true){
        res.render("addItems");
        } else {
            res.redirect("/login");
        }
});

app.post("/addItems",(req,res) => {//write to Scripture data (create)
    if(authUser === true){ knex('BookOfMormon').insert(req.body)
        .then(addResults => {
            res.redirect('/'); //change to Display Home Page when done
        });
    } else {
        res.redirect("/login");
    }
});

app.get("/deleteScripture/:bomID",(req,res) => {//deletes record from table
    if(authUser === true){ knex('BookOfMormon').where('bomID',req.params.bomID).del()
        .then(delResult => {
            res.redirect('/'); //change to Display Index Page when done
        }).catch(err => { 
            console.log(err);
            res.status(500).json({err});
        });
    } else {
        res.redirect("/login");
    }
});

app.get("/editScripture/:bomID",(req,res) => {//displays edit page
    if(authUser === true){ knex('BookOfMormon').where('bomID',req.params.bomID)
        .then(bomInfo => {
            res.render('editScripture',{scripData: bomInfo});
        }).catch(err => { 
            console.log(err);
            res.status(500).json({err});
        });
    } else {
        res.redirect("/login");
    }
});

app.post("/editScripture",(req,res) => {//updates the changed data
    if(authUser === true){ knex('BookOfMormon').where('bomID',req.body.lookupID)
    .update({
        'bomLocation': req.body.bomLocation,
        'bomScripture': req.body.bomScripture
    })
        .then(editResults => {
            res.redirect('/'); //changes to displayData page when done
        }).catch(err => { 
            console.log(err);
            res.status(500).json({err});
        });
    } else {
        res.redirect("/login");
    }
});

app.get("/filter1", (req,res) => { knex('BookOfMormon') //filter based on scripture location
  .where('bomLocation','like', `%1 Nephi%`).orderBy('bomID')
  .then(scripInfo=> {
    res.render("index",{scripData: scripInfo});
    }).catch(err => {
        console.log(err);
        res.status(500).json({err});
    });

});
app.get("/filter2", (req,res) => { knex('BookOfMormon') //filter based on scripture location
  .where('bomLocation','like', `%2 Nephi%`).orderBy('bomID')
  .then(scripInfo=> {
    res.render("index",{scripData: scripInfo});
    }).catch(err => {
        console.log(err);
        res.status(500).json({err});
    });

});
