const express = require('express');
const cors = require('cors')
const app = express();
const swaggerDocument = require('./swagger.json');
const swaggerUI = require('swagger-ui-express');

const users = [
    {
        id: 1,
        firstName: "Mike",
        lastName: "Veilleux",
        jobTitle: "Intern"
    },
    {
        id: 2,
        firstName: "John",
        lastName: "Doe",
        jobTitle: "CEO"
    },
    {
        id: 3,
        firstName: "Jane",
        lastName: "Doe",
        jobTitle: "CTO"
    }
]

app.use(cors());
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));
app.use(express.urlencoded({ extended: true }));
app.use(express.json())


app.get(('/users/all'), (req, res) => {
    res.send(users)
    console.log(users)
})


app.get(('/users/:userID'), (req, res) => {
    const id = Number(req.params.userID);
    const matchIndex = users.map(usr => usr.id).indexOf(id)
    if (matchIndex > -1) {
        console.log(users[matchIndex])
        res.send(users[matchIndex])
    } else {
        console.log(`No user with id:${id} found in database`)
        res.status(204).send(`No user with id:${id} found in database`)
    }
})

app.post(('/users'), (req, res) => {
    try {
        const idArr = users.map(user => user.id)
        const nextAvailableID = Math.max.apply(null, idArr) + 1
        const newUser = {
            id: nextAvailableID,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            jobTitle: req.body.jobTitle
        }
        users.push(newUser);
        console.log(newUser)
        res.send(newUser)
    } catch (error) {
        res.status(204).send("Internal error, No new user created.")
        console.log("Internal error, No new user created.")
    }
})

app.patch(('/users/:userID/:newJobTitle'), (req, res) => {
    const id = Number(req.params.userID);
    const newJobTitle = req.params.newJobTitle;
    const matchIndex = users.map(usr => usr.id).indexOf(id)
    if (matchIndex > -1) {
        const updatedUser = { ...users[matchIndex], jobTitle: newJobTitle }
        users.splice(matchIndex, 1, updatedUser)
        console.log(updatedUser)
        res.send(updatedUser)
    } else {
        console.log(`No user with id:${id} found in database`)
        res.status(204).send(`No user with id:${id} found in database`)
    }

})

// https://stackoverflow.com/a/70869985
app.delete(('/users/:deleteById'), (req, res) => {
    const id = Number(req.params.deleteById);
    const matchIndex = users.map(usr => usr.id).indexOf(id)
    if (matchIndex > -1) {
        const deletedUser = { ...users[matchIndex] }
        users.splice(matchIndex, 1)
        res.send(`User with id:${id} deleted from database`)
    } else {
        res.status(204).send(`No user with id:${id} found in database`)
    }
})


app.listen(443, () => {
    console.log(`Running on http://localhost:${443}`)
})