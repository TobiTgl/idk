const Pool = require('pg').Pool

const pool = new Pool({
  user: 'mzvruebchhmeij',
  host: 'ec2-54-225-214-37.compute-1.amazonaws.com',
  database: 'd6neapffcb6jah',
  password: '8826d340371d2dc3f4d4f0dc4e4ba9586ee3434cdb8112f07407897987cc6ab1',
  port: 5432,
})

const getMatches = (request, response) => {
    pool.query('SELECT * FROM matches', (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).json(results.rows)
    })
  }

  const insertMaches = (request, response) => {

    console.log(request.body)
    const { id, dateum, opponentone, opponenttwo, opponentonescore, opponenttwoscore} = request.body
  
    pool.query('INSERT INTO public.apidata(id, dateum, opponentone, opponenttwo, opponentonescore, opponenttwoscore) VALUES($1, $2, $3, $4, $5, $6)', [id, dateum, opponentone, opponenttwo, opponentonescore, opponenttwoscore], (error, results) => {
      if (error) {
        throw error
      }
      response.status(201).send(`Match added with ID: ${results.id}`)
    })
  }
  

module.exports = {
  getMatches,
  insertMaches
};
