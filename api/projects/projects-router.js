const express = require('express')

const Projects = require('../projects/projects-model')

const router = express.Router()

router.get('/', (req, res, ) => {
    Projects.get()
        .then(projects => {
            res.json(projects)
        })
        .catch()
})

router.get('/:id', (req, res) => {
    Projects.get(req.params.id)
        .then(projects => {
            if(!projects){
                res.status(404).json({
                    message: 'The project with the specified ID does not exists'
                })
            } else {
                res.json(projects)
            }
        })
        .catch()
})









module.exports = router