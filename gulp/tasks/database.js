const gulp = require('gulp')
const {connection} = require('../../knexfile')
const exec = require('child_process').exec

gulp.task('db:create', function(cb) {
  let cmd = `createdb ${connection.user !== '' ? '-O ' + connection.user : ''} ${connection.database}`
  console.log(cmd)
  exec(cmd, cb)
})

gulp.task('db:drop', function(cb) {
  let cmd = `dropdb --if-exists ${connection.database}`
  console.log(cmd)
  exec(cmd, cb)
})

function pgParams(config) {
  let list = []
  if(config.user) list.push(`-U ${config.user}`)
  if(config.host) list.push(`-h ${config.host}`)
  list.push(`-d ${connection.database}`)
  return list.join(' ')
}

gulp.task('db:import', function(cb) {
  if(process.env.NODE_ENV === 'production') {
    return cb(new Error('Import in production!'))
  }
  let cmd = `PGPASSWORD=${connection.password || '""'} pg_restore ${pgParams(connection)} --disable-triggers -x -O tmp/db.dump`
  console.log(cmd)
  exec(cmd, cb)
})
