const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('./config/dbConfig')

const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: false }));
const port = 3001

app.use('/api/investors', require('./routes/investor'));
app.use('/api/projects', require('./routes/project'));
app.use('/api/investments', require('./routes/Investments'));
app.use('/api/accounts', require('./routes/Account'));
app.use('/api/sendmail', require('./routes/send_mail'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/project_file', require('./routes/project_file'));

app.use('/', (req, res) => {
    res.send('Endpoint')
});


app.listen(port, () => {
    console.log('Server started at port ' + port)
})
