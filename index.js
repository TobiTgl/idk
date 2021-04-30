const express = require('express')
const app = express()
const port = 4000
const bodyParser = require('body-parser')
const cors = require('cors');
const axios = require('axios');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const passportHttp = require('passport-http');


const Pool = require('pg').Pool

app.use(cors());
app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

const pool = new Pool({
  
  user: 'mzvruebchhmeij',
  host: 'ec2-54-225-214-37.compute-1.amazonaws.com',
  database: 'd6neapffcb6jah',
  password: '8826d340371d2dc3f4d4f0dc4e4ba9586ee3434cdb8112f07407897987cc6ab1',
  port: 5432,
})

app.get('/', (req, res) => {
  res.send('Hello World! TEEEEEEEEEST')
})

app.get('/user', passport.authenticate('basic', {session: false}), (req, res) => {
  pool.query('SELECT * FROM users WHERE id=$1',[3]).then(results => {
    
    res.json(results.rows);
    res.sendStatus(200);          
})
})

app.post('/favouriteTeam', (req, res) => {
  
  pool.query('Update users set favorite_team_id = ($1) where id = ($2)', [req.body.favourite_team_id, req.body.user_id]).then(results => {
    res.json(results.rows);
  })
})
app.post('/bets', (req, res) => {
  
  pool.query('Insert into bets(users_id, bonus, match_id, bet, status, datestamp) values ($1, $2, $3, $4, $5, $6)', [req.body.users_id, req.body.bonus, req.body.match_id, req.body.bet, req.body.status, req.body.datestamp]).then(results => {
    res.json(results.rows);
  })
})

app.get('/matches', (req, res) => {
  
  pool.query('SELECT * FROM match').then(results => {
    res.json(results.rows);
  })
}) 

app.get('/games', (req, res) => {
  
  pool.query('SELECT * FROM games').then(results => {
    res.json(results.rows);
  })
})

app.get('/pastmatches', (req, res) => {
  
  pool.query("SELECT ns.id, match_id, ns.name as match_name, public.tournaments.name as tournament_name, match_type, ns.tournament_id, team1_id, team2_id, ns.winner_id, ns.begin_at, official_stream_url, team1.name as team1_name, team1.image_url as team1_url, team2.name as team2_name, team2.image_url as team2_url, ns.number_of_games,(select count (s.id) from games as s where s.winner_id = ns.team1_id and s.match_id = ns.match_id) as team1_score,(select count (s.id) from games as s where s.winner_id = ns.team2_id and s.match_id = ns.match_id) as team2_score, videogame_id FROM public.match as ns inner join public.tournaments on ns.tournament_id = public.tournaments .tournament_id inner join public.team as team1 on ns.team1_id = team1.team_id inner join public.team as team2 on ns.team2_id = team2.team_id inner join leagues on ns.league_id  = leagues.league_id  where to_timestamp(ns.begin_at, 'YYYY-MM-DD') < now() order by to_timestamp(ns.begin_at, 'YYYY-MM-DD') desc").then(results => {
    res.json(results.rows);
  })
})

app.get('/futurematches', (req, res) => {
  
  pool.query("SELECT ns.id, match_id, ns.name as match_name, public.tournaments.name as tournament_name, match_type, ns.tournament_id, team1_id, team2_id, ns.winner_id, ns.begin_at, official_stream_url, team1.name as team1_name, team1.image_url as team1_url, team2.name as team2_name, team2.image_url as team2_url, ns.number_of_games,(select count (s.id) from games as s where s.winner_id = ns.team1_id and s.match_id = ns.match_id) as team1_score,(select count (s.id) from games as s where s.winner_id = ns.team2_id and s.match_id = ns.match_id) as team2_score, videogame_id FROM public.match as ns inner join public.tournaments on ns.tournament_id = public.tournaments .tournament_id inner join public.team as team1 on ns.team1_id = team1.team_id inner join public.team as team2 on ns.team2_id = team2.team_id inner join leagues on ns.league_id  = leagues.league_id  where to_timestamp(ns.begin_at, 'YYYY-MM-DD') > now() order by to_timestamp(ns.begin_at, 'YYYY-MM-DD')").then(results => {
    res.json(results.rows);
  })
})

app.get('/bets', (req, res) => {
  
  pool.query('SELECT * FROM bets').then(results => {
    res.json(results.rows);
  })
})

app.get('/leaderboard', (req, res) => {
  
  pool.query('SELECT * FROM leaderboard').then(results => {
    res.json(results.rows);
  })
})
app.get('/leagues', (req, res) => {
  
  pool.query('SELECT * FROM leagues').then(results => {
    res.json(results.rows);
  })
})
app.get('/series', (req, res) => {
  
  pool.query('SELECT * FROM series').then(results => {
    res.json(results.rows);
  })
})
app.get('/team', (req, res) => {
  
  pool.query('SELECT * FROM team').then(results => {
    res.json(results.rows);
  })
})
app.get('/tournaments', (req, res) => {
  
  pool.query("SELECT public.tournaments.id, public.tournaments.begin_at, public.tournaments.end_at, public.tournaments.tournament_id, public.tournaments.league_id, prizepool, public.tournaments.serie_id, public.tournaments.name, public.tournaments.winner_id, teams, videogame_id FROM public.leagues inner join match on public.leagues.league_id = public.match.league_id inner join tournaments on public.match.tournament_id = public.tournaments.tournament_id order by to_timestamp(public.tournaments.begin_at, 'YYYY-MM-DD') desc").then(results => {
    res.json(results.rows);
  })
})
app.get('/videogame', (req, res) => {
  
  pool.query('SELECT * FROM videogame').then(results => {
    res.json(results.rows);
  })
})


let saltRounds = 6;

app.get('/', (req, res) => {
  res.send('Hello World!')
})


app.post('/register', (req,res) =>{

  let username = req.body.username.trim();
  let password = req.body.password.trim();
  let email = req.body.email.trim();

  console.log(req.body)

  console.log(username.length);

  if((typeof username === "string") &&
     (username.length > 4) &&
     (typeof password === "string") &&
     (password.length > 5))
  {
    bcrypt.hash(password, saltRounds).then(hash =>
      pool.query('INSERT INTO users (login, password, email) VALUES ($1,$2,$3)', [username, hash, email])
    )
    .then(dbResults => {
        console.log(dbResults);
        res.sendStatus(201);
    })
    .catch(error => error);//res.sendStatus(500)

    
  }
  else {
    console.log("incorrect username or password, both must be strings and username more than 4 long and password more than 5 characters long");
    res.sendStatus(400);
  }
})


passport.use( new passportHttp.BasicStrategy((username, password, cb) => {
  try{
    pool.query('SELECT * FROM users WHERE login = $1', [username]).then(dbResults => {
      console.log(dbResults.rows[0])
      if(dbResults.rows.length == 0)
      {
        return cb(null, false);
      }
      console.log(dbResults.rows[0].password)
  
      bcrypt.compare(password, dbResults.rows[0].password, function(err,res) {
        if(res) {
          console.log("success");
          return cb(null, true);
        }
        else {
            console.log("wrong password");
            return cb(null, false);
        }			
          response.end();      
      })
  
    })
  }
  catch (error){
    console.log(error)
  }}));

app.post('/login', passport.authenticate('basic', {session: false}), (req, res)=>{
  console.log(req.user);
  res.sendStatus(200);
})






app.listen(process.env.PORT || 4000)