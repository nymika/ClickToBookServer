const mongoose = require('mongoose');
const connection = "mongodb+srv://Nym:mongochikki@click-to-book-cluster-ghs1g.mongodb.net/click-to-book-DB?retryWrites=true&w=majority";
//mongo "mongodb+srv://click-to-book-cluster-ghs1g.mongodb.net/<dbname>" --username Nym
mongoose.connect(connection,{ useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false})
    .then(() => console.log("Database Connected Successfully"))
    .catch(err => console.log(err));