const { Pool } = require('pg')

const pool = new Pool({
  user: 'mzvruebchhmeij',
  host: 'ec2-54-225-214-37.compute-1.amazonaws.com',
  database: 'd6neapffcb6jah',
  password: '8826d340371d2dc3f4d4f0dc4e4ba9586ee3434cdb8112f07407897987cc6ab1',
  port: 5432,
  ssl: true
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
})

pool.connect((err, client, release) => {
  if (err) {
    return console.error('Error acquiring client', err.stack)
  }
  client.query('SELECT NOW()', (err, result) => {
    release()
    if (err) {
      return console.error('Error executing query', err.stack)
    }
    console.log(result.rows)
  })
})

module.exports = pool;