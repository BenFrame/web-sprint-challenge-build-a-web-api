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

router.post('/', (req, res) => {
    // console.log("post endpoint", req.body );
    const{name, description, completed} = req.body
    // eslint-disable-next-line no-prototype-builtins
    if(!name || !description || ! req.body?.hasOwnProperty("completed") ){
        res.status(400).json({
            message: 'Please provide name, description, or completed'
        })
    }else{
        Projects.insert({name, description, completed})
        .then(({id}) =>{
            return Projects.get(id)
        })
        .then(post => {
            res.status(201).json(post)
        })
        .catch()
    }
})

router.put('/:id', (req, res) =>{
    const {name, description, completed} = req.body
    // eslint-disable-next-line no-prototype-builtins
    if(!name || !description || ! req.body?.hasOwnProperty("completed") ){
        res.status(400).json({
            message: 'Please provide name, description, or completed'
        })
    } else {
        Projects.get(req.params.id)
        .then(post => {
            if(!post){
                res.status(404).json({
                    message: 'The project with the specified ID does not exists'
                })
            } else{
                return Projects.update(req.params.id, req.body)
            }
        })
        .then(data => {
            if(data){
                return Projects.get(req.params.id)
            }
        })
        .then(post => {
            if(post){
                res.json(post)
            }
        })
        .catch()
    }
})







module.exports = router