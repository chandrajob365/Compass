const express = require('express')
const app = express()

app.use(express.static('public'))

app.listen(process.env.PORT || 8000, () => {
  console.log('Server running @ ', process.env.PORT || 8000)
})
