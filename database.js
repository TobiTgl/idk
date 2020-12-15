const Pool = require('pg').Pool

const pool = new Pool({
  user: 'htjvnhyvgarbte',
  host: 'ec2-3-220-222-72.compute-1.amazonaws.com',
  database: 'd4nksbfdqqomv0',
  password: '0f0f0b28d8230d569051e787f8d0d091ca8e0560038d4860a1b84bbca129cf96',
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
