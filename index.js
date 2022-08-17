const port = process.env.PORT || 3001;
let express = require("express");
let path = require('path');
let app = express();
app.set("view engine","ejs");
app.use(express.static(path.join(__dirname, '/public')));//for images

app.use(express.urlencoded({extended: true}));//needed to POST and manipulate data

const knex = require(path.join(__dirname + '/knex/knex.js'));
/*
Removed because now exists in knex file
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
*/

app.listen(port, () => {console.log("Listener active on port ");});

var authUser = false;//to start on login page

app.get("/login", function(req,res) //login page
{ 
    res.render("login")
});

app.post("/login",function(req,res) {//login post
    knex('User').where("userID",req.body.userID)
    .andWhere('userPassword',req.body.userPassword)
    .then(results => {
        if(results.length > 0) {
            console.log("User is Authorized");
            authUser = true;
            res.redirect("/")
        } else {
            res.redirect("/login")
        }
    });
});


app.post("/logout", function(req,res) //logs user out
{ 
    authUser = false;
    res.redirect("/login") 
});

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
app.get("/filter3", (req,res) => { knex('BookOfMormon') //filter based on scripture location
  .where('bomLocation','like', `%Jacob%`).orderBy('bomID')
  .then(scripInfo=> {
    res.render("index",{scripData: scripInfo});
    }).catch(err => {
        console.log(err);
        res.status(500).json({err});
    });

});

app.get("/filter4", (req,res) => { knex('BookOfMormon') //filter based on scripture location
  .where('bomLocation','like', `%Mosiah%`).orderBy('bomID')
  .then(scripInfo=> {
    res.render("index",{scripData: scripInfo});
    }).catch(err => {
        console.log(err);
        res.status(500).json({err});
    });

});

app.get("/filter5", (req,res) => { knex('BookOfMormon') //filter based on scripture location
  .where('bomLocation','like', `%Alma%`).orderBy('bomID')
  .then(scripInfo=> {
    res.render("index",{scripData: scripInfo});
    }).catch(err => {
        console.log(err);
        res.status(500).json({err});
    });

});

app.get("/filter6", (req,res) => { knex('BookOfMormon') //filter based on scripture location
  .where('bomLocation','like', `%Helaman%`).orderBy('bomID')
  .then(scripInfo=> {
    res.render("index",{scripData: scripInfo});
    }).catch(err => {
        console.log(err);
        res.status(500).json({err});
    });

});

app.get("/filter7", (req,res) => { knex('BookOfMormon') //filter based on scripture location
  .where('bomLocation','like', `%3 Nephi%`).orderBy('bomID')
  .then(scripInfo=> {
    res.render("index",{scripData: scripInfo});
    }).catch(err => {
        console.log(err);
        res.status(500).json({err});
    });

});

app.get("/filter8", (req,res) => { knex('BookOfMormon') //filter based on scripture location
  .where('bomLocation','like', `%4 Nephi%`).orderBy('bomID')
  .then(scripInfo=> {
    res.render("index",{scripData: scripInfo});
    }).catch(err => {
        console.log(err);
        res.status(500).json({err});
    });

});

app.get("/filter9", (req,res) => { knex('BookOfMormon') //filter based on scripture location
  .where('bomLocation','like', `%Mormon%`).orderBy('bomID')
  .then(scripInfo=> {
    res.render("index",{scripData: scripInfo});
    }).catch(err => {
        console.log(err);
        res.status(500).json({err});
    });

});

app.get("/filter10", (req,res) => { knex('BookOfMormon') //filter based on scripture location
  .where('bomLocation','like', `%Ether%`).orderBy('bomID')
  .then(scripInfo=> {
    res.render("index",{scripData: scripInfo});
    }).catch(err => {
        console.log(err);
        res.status(500).json({err});
    });

});

app.get("/filter11", (req,res) => { knex('BookOfMormon') //filter based on scripture location
  .where('bomLocation','like', `%Moroni%`).orderBy('bomID')
  .then(scripInfo=> {
    res.render("index",{scripData: scripInfo});
    }).catch(err => {
        console.log(err);
        res.status(500).json({err});
    });

});
