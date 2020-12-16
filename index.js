const express = require('express')
const app = express()
const port = 4000
const db = require('./database')
const bodyParser = require('body-parser')
const cors = require('cors');
const axios = require('axios');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const passportHttp = require('passport-http');

var CronJob = require('cron').CronJob;

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
  res.send('Hello World!')
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


let jsonMas = null;

let one = 'https://api.pandascore.co/lol/matches?token=6W1WQp6WMqtt7LmweMkgLv6YyoUMhauuKE1ABezjHsFPD1GNU6U'
let two = 'https://api.pandascore.co/csgo/matches?token=6W1WQp6WMqtt7LmweMkgLv6YyoUMhauuKE1ABezjHsFPD1GNU6U'
let three = 'https://api.pandascore.co/lol/tournaments?token=6W1WQp6WMqtt7LmweMkgLv6YyoUMhauuKE1ABezjHsFPD1GNU6U'
let four = 'https://api.pandascore.co/csgo/tournaments?token=6W1WQp6WMqtt7LmweMkgLv6YyoUMhauuKE1ABezjHsFPD1GNU6U'

const requestOne = axios.get(one);
const requestTwo = axios.get(two);
const requestThree = axios.get(three);
const requestFour = axios.get(four);

axios.all([requestOne, requestTwo, requestThree, requestFour]).then(axios.spread((...responses) => {
  const responseOne = responses[0].data
  const responseTwo = responses[1].data
  const responseThree = responses[2].data
  const responseFour = responses[3].data
  
})).catch(errors => {
  // react on errors.
})



var job = new CronJob('0 */1 * * * *', function(){
//'0 */1 * * * *'

console.log('test') 

axios.all([requestOne, requestTwo, requestThree, requestFour]).then(axios.spread((...responses) => {
  const jsonMas = responses[0].data
  const csgoData = responses[1].data
  const lolTournamentTeams = responses[2].data
  const csgoTournamentTeams = responses[3].data

/*axios.get('https://api.pandascore.co/csgo/matches?token=6W1WQp6WMqtt7LmweMkgLv6YyoUMhauuKE1ABezjHsFPD1GNU6U')//this is a promise object
.then((response) => { //javascrip promise --then
  jsonMas = response.data*/

for (x = 0; x<jsonMas.length; x++) {

  let begin_at = jsonMas[x].begin_at
  let end_at = jsonMas[x].end_at
  let league_id = jsonMas[x].league_id
  let tournament_id = jsonMas[x].tournament_id
  let match_type = jsonMas[x].match_type
  let winner_id = jsonMas[x].winner_id
  let serie_id = jsonMas[x].serie_id
  let number_of_games = jsonMas[x].number_of_games
  let official_stream_url = jsonMas[x].official_stream_url
  let match_id = jsonMas[x].id
  let match_name = jsonMas[x].name
  let videogame_id = jsonMas[x].videogame.id
  let videogame_name = jsonMas[x].videogame.name

  let league_name = jsonMas[x].league.name
  let league_url = jsonMas[x].league.url
  let league_image_url = jsonMas[x].league.image_url

  let serie_begin_at = jsonMas[x].serie.begin_at
  let serie_end_at = jsonMas[x].serie.end_at
  let serie_full_name = jsonMas[x].serie.full_name
  let serie_name = jsonMas[x].serie.name
  let serie_tier = jsonMas[x].serie.tier
  let serie_winner_id = jsonMas[x].serie.winner_id
  let serie_year = jsonMas[x].serie.year

  let tournament_begin_at = jsonMas[x].tournament.begin_at
  let tournament_end_at = jsonMas[x].tournament.end_at
  //let tournament_id = jsonMas[x].tournament.id
  let tournament_prizepool = jsonMas[x].tournament.prizepool
  let tournament_name = jsonMas[x].tournament.name

  for (y = 0; y<jsonMas[x].opponents.length-1; y++) {
    let match_team1_id = jsonMas[x].opponents[y].opponent.id
    let match_team2_id = jsonMas[x].opponents[y+1].opponent.id

 //Match query
  
pool.query('INSERT INTO match(match_id, name, match_type, tournament_id, serie_id, team1_id, team2_id, league_id, number_of_games, winner_id, begin_at, end_at, official_stream_url) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) ON CONFLICT (match_id) DO UPDATE SET match_id= excluded.match_id, name= excluded.name, match_type= excluded.match_type, tournament_id= excluded.tournament_id, serie_id= excluded.serie_id, team1_id= excluded.team1_id, team2_id= excluded.team2_id, league_id= excluded.league_id, number_of_games= excluded.number_of_games, winner_id= excluded.winner_id, begin_at= excluded.begin_at, end_at= excluded.end_at, official_stream_url= excluded.official_stream_url' , [match_id, match_name, match_type, tournament_id, serie_id, match_team1_id, match_team2_id, league_id, number_of_games, winner_id, begin_at, end_at, official_stream_url], (error, results) => {
  if (error) { //ON CONFLICT (match_id) DO NOTHING 
    throw error
  }
})

//Leagues query

pool.query('INSERT INTO leagues(league_id, videogame_id, image_url, name, url) VALUES($1, $2, $3, $4, $5) ON CONFLICT (league_id) DO UPDATE SET league_id=excluded.league_id, videogame_id= excluded.videogame_id, image_url=excluded.image_url, name=excluded.name, url=excluded.url', [league_id, videogame_id= videogame_id,  league_image_url, league_name, league_url], (error, results) => {
  if (error) {
    throw error
  }
})

//Tournaments query

    pool.query('INSERT INTO tournaments(begin_at, end_at, tournament_id, league_id, prizepool, serie_id, name, winner_id) VALUES($1, $2, $3, $4, $5, $6, $7, $8) ON CONFLICT (tournament_id) DO UPDATE SET begin_at=excluded.begin_at, end_at=excluded.end_at, tournament_id=excluded.tournament_id, league_id=excluded.league_id, prizepool=excluded.prizepool, serie_id=excluded.serie_id, name=excluded.name, winner_id=excluded.winner_id', [tournament_begin_at, tournament_end_at, tournament_id, league_id, tournament_prizepool, serie_id, tournament_name, winner_id], (error, results) => {
      if (error) {
        throw error
      }
    })

//series query

    pool.query('INSERT INTO series(serie_id, begin_at, end_at, full_name, league_id, name, tier, winner_id, year) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) ON CONFLICT (serie_id) DO UPDATE SET serie_id=excluded.serie_id, begin_at=excluded.begin_at, end_at=excluded.end_at, full_name=excluded.full_name, league_id=excluded.league_id, name=excluded.name, tier=excluded.tier, winner_id=excluded.winner_id, year=excluded.year', [serie_id, serie_begin_at, serie_end_at, serie_full_name, league_id, serie_name, serie_tier, serie_winner_id, serie_year], (error, results) => {
      if (error) {
        throw error
      }
    })
//videogame query

/*
    pool.query('INSERT INTO videogame(name) VALUES($1)ON CONFLICT (name) DO NOTHING' , [videogame_name], (error, results) => {
      if (error) {
        throw error
      }
    })
*/
  }
  for (y = 0; y<jsonMas[x].opponents.length; y++) {
    

    let team1_id = jsonMas[x].opponents[y].opponent.id
    let team1_name = jsonMas[x].opponents[y].opponent.name
    let team1_acronym = jsonMas[x].opponents[y].opponent.acronym
    let team1_imageUrl = jsonMas[x].opponents[y].opponent.image_url
    let team1_location = jsonMas[x].opponents[y].opponent.location
  
    //Teams query

    pool.query('INSERT INTO team(team_id, name, acronym, image_url, location) VALUES($1, $2, $3, $4, $5) ON CONFLICT (team_id) DO UPDATE SET team_id=excluded.team_id, name=excluded.name, acronym=excluded.acronym, image_url=excluded.image_url, location=excluded.location', [team1_id, team1_name, team1_acronym, team1_imageUrl, team1_location], (error, results) => {
      if (error) {
        throw error
      }
    })
  }
  for (y = 0; y<jsonMas[x].games.length; y++) {
    let game_id = jsonMas[x].games[y].id
    let game_begin_at = jsonMas[x].games[y].begin_at
    let game_end_at = jsonMas[x].games[y].end_at
    let game_complete = jsonMas[x].games[y].complete
    let game_finished = jsonMas[x].games[y].finished
    let game_length = jsonMas[x].games[y].length
    let game_position = jsonMas[x].games[y].position
    let game_status = jsonMas[x].games[y].status
    let game_winner_id = jsonMas[x].games[y].winner.id
    
//games query

    pool.query('INSERT INTO games(game_id, match_id, begin_at, end_at, complete, finished, length, position, status, winner_id) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) ON CONFLICT (game_id) DO UPDATE SET game_id=excluded.game_id, match_id=excluded.match_id, begin_at=excluded.begin_at, end_at=excluded.end_at, complete=excluded.complete, finished=excluded.finished, length=excluded.length, position=excluded.position, status=excluded.status, winner_id=excluded.winner_id', [game_id, match_id, game_begin_at, game_end_at, game_complete, game_finished, game_length, game_position, game_status, game_winner_id], (error, results) => {
      if (error) {
        throw error
      }
    })  
  } 
  
}


for (x = 0; x<csgoData.length; x++) {
  

    let begin_at = csgoData[x].begin_at
    let end_at = csgoData[x].end_at
    let league_id = csgoData[x].league_id
    let tournament_id = csgoData[x].tournament_id
    let match_type = csgoData[x].match_type
    let winner_id = csgoData[x].winner_id
    let serie_id = csgoData[x].serie_id
    let number_of_games = csgoData[x].number_of_games
    let official_stream_url = csgoData[x].official_stream_url
    let match_id = csgoData[x].id
    let match_name = csgoData[x].name
    let videogame_id = csgoData[x].videogame.id
    let videogame_name = csgoData[x].videogame.name
  
    let league_name = csgoData[x].league.name
    let league_url = csgoData[x].league.url
    let league_image_url = csgoData[x].league.image_url
  
    let serie_begin_at = csgoData[x].serie.begin_at
    let serie_end_at = csgoData[x].serie.end_at
    let serie_full_name = csgoData[x].serie.full_name
    let serie_name = csgoData[x].serie.name
    let serie_tier = csgoData[x].serie.tier
    let serie_winner_id = csgoData[x].serie.winner_id
    let serie_year = csgoData[x].serie.year
  
    let tournament_begin_at = csgoData[x].tournament.begin_at
    let tournament_end_at = csgoData[x].tournament.end_at
    //let tournament_id = jsonMas[x].tournament.id
    let tournament_prizepool = csgoData[x].tournament.prizepool
    let tournament_name = csgoData[x].tournament.name
  
    for (y = 0; y<csgoData[x].opponents.length-1; y++) {
      let match_team1_id = csgoData[x].opponents[y].opponent.id
      let match_team2_id = csgoData[x].opponents[y+1].opponent.id
  
  //Match query
  
  pool.query('INSERT INTO match(match_id, name, match_type, tournament_id, serie_id, team1_id, team2_id, league_id, number_of_games, winner_id, begin_at, end_at, official_stream_url) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) ON CONFLICT (match_id) DO UPDATE SET match_id= excluded.match_id, name= excluded.name, match_type= excluded.match_type, tournament_id= excluded.tournament_id, serie_id= excluded.serie_id, team1_id= excluded.team1_id, team2_id= excluded.team2_id, league_id= excluded.league_id, number_of_games= excluded.number_of_games, winner_id= excluded.winner_id, begin_at= excluded.begin_at, end_at= excluded.end_at, official_stream_url= excluded.official_stream_url' , [match_id, match_name, match_type, tournament_id, serie_id, match_team1_id, match_team2_id, league_id, number_of_games, winner_id, begin_at, end_at, official_stream_url], (error, results) => {
    if (error) { //ON CONFLICT (match_id) DO NOTHING 
      throw error
    }
  })

 //Leagues query

  pool.query('INSERT INTO leagues(league_id, videogame_id, image_url, name, url) VALUES($1, $2, $3, $4, $5) ON CONFLICT (league_id) DO UPDATE SET league_id=excluded.league_id, videogame_id= excluded.videogame_id, image_url=excluded.image_url, name=excluded.name, url=excluded.url', [league_id, videogame_id= videogame_id,  league_image_url, league_name, league_url], (error, results) => {
    if (error) {
      throw error
    }
  })
  
  //Tournaments query
  
      pool.query('INSERT INTO tournaments(begin_at, end_at, tournament_id, league_id, prizepool, serie_id, name, winner_id) VALUES($1, $2, $3, $4, $5, $6, $7, $8) ON CONFLICT (tournament_id) DO UPDATE SET begin_at=excluded.begin_at, end_at=excluded.end_at, tournament_id=excluded.tournament_id, league_id=excluded.league_id, prizepool=excluded.prizepool, serie_id=excluded.serie_id, name=excluded.name, winner_id=excluded.winner_id', [tournament_begin_at, tournament_end_at, tournament_id, league_id, tournament_prizepool, serie_id, tournament_name, winner_id], (error, results) => {
        if (error) {
          throw error
        }
      })
  
  //series query
  
      pool.query('INSERT INTO series(serie_id, begin_at, end_at, full_name, league_id, name, tier, winner_id, year) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) ON CONFLICT (serie_id) DO UPDATE SET serie_id=excluded.serie_id, begin_at=excluded.begin_at, end_at=excluded.end_at, full_name=excluded.full_name, league_id=excluded.league_id, name=excluded.name, tier=excluded.tier, winner_id=excluded.winner_id, year=excluded.year', [serie_id, serie_begin_at, serie_end_at, serie_full_name, league_id, serie_name, serie_tier, serie_winner_id, serie_year], (error, results) => {
        if (error) {
          throw error
        }
      })
  //videogame query
  
  /*
      pool.query('INSERT INTO videogame(name) VALUES($1)ON CONFLICT (name) DO NOTHING' , [videogame_name], (error, results) => {
        if (error) {
          throw error
        }
      })
  */
    }
    for (y = 0; y<csgoData[x].opponents.length; y++) {
      
  
      let team1_id = csgoData[x].opponents[y].opponent.id
      let team1_name = csgoData[x].opponents[y].opponent.name
      let team1_acronym = csgoData[x].opponents[y].opponent.acronym
      let team1_imageUrl = csgoData[x].opponents[y].opponent.image_url
      let team1_location = csgoData[x].opponents[y].opponent.location
    
      //Teams query
  
      pool.query('INSERT INTO team(team_id, name, acronym, image_url, location) VALUES($1, $2, $3, $4, $5) ON CONFLICT (team_id) DO UPDATE SET team_id=excluded.team_id, name=excluded.name, acronym=excluded.acronym, image_url=excluded.image_url, location=excluded.location', [team1_id, team1_name, team1_acronym, team1_imageUrl, team1_location], (error, results) => {
        if (error) {
          throw error
        }
      })
    }
    for (y = 0; y<csgoData[x].games.length; y++) {
      let game_id = csgoData[x].games[y].id
      let game_begin_at = csgoData[x].games[y].begin_at
      let game_end_at = csgoData[x].games[y].end_at
      let game_complete = csgoData[x].games[y].complete
      let game_finished = csgoData[x].games[y].finished
      let game_length = csgoData[x].games[y].length
      let game_position = csgoData[x].games[y].position
      let game_status = csgoData[x].games[y].status
      let game_winner_id = csgoData[x].games[y].winner.id
      
  //games query
  
      pool.query('INSERT INTO games(game_id, match_id, begin_at, end_at, complete, finished, length, position, status, winner_id) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) ON CONFLICT (game_id) DO UPDATE SET game_id=excluded.game_id, match_id=excluded.match_id, begin_at=excluded.begin_at, end_at=excluded.end_at, complete=excluded.complete, finished=excluded.finished, length=excluded.length, position=excluded.position, status=excluded.status, winner_id=excluded.winner_id', [game_id, match_id, game_begin_at, game_end_at, game_complete, game_finished, game_length, game_position, game_status, game_winner_id], (error, results) => {
        if (error) {
          throw error
        }
      })  
    } 
    
  }

  for (x = 0; x<lolTournamentTeams.length; x++) {
    let lolTeams = lolTournamentTeams[x].teams
    let tournament_id = lolTournamentTeams[x].tournament_id

    pool.query('update tournaments set teams = ($1) where tournament_id = ($2)' , [lolTeams, tournament_id], (error, results) => {
      if (error) {
        throw error
      }
    })
  }
  for (x = 0; x<csgoTournamentTeams.length; x++) {
    let csgoTeams = csgoTournamentTeams[x].teams
    let tournament_id = lolTournamentTeams[x].tournament_id

    pool.query('update tournaments set teams = ($1) where tournament_id = ($2)' , [csgoTeams, tournament_id], (error, results) => {
      if (error) {
        throw error
      }
    })
  }
})).catch(errors => {
  console.log(errors)
})
} , null, true, 'America/Los_Angeles');
job.start();


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


/*
app.get('/users', (req, res) => {
  db.query('SELECT * FROM users').then(results => {
    res.json(results);
  })
});
*/

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