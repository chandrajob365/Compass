const express = require('express')
const app = express()

app.use(express.static('public'))
// process.env.PORT ||
app.listen(process.env.PORT || 8033, () => {
  console.log('Server running @ ', process.env.PORT || 8033)
})
