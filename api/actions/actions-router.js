const express = require('express')

const Actions = require('../actions/actions-model')

const router = express.Router()

router.get('/', (req, res, ) => {
    Actions.get()
        .then(actions => {
            res.json(actions)
        })
        .catch()
})

router.get('/:id', (req, res) => {
    Actions.get(req.params.id)
        .then(actions => {
            if(!actions){
                res.status(404).json({
                    message: 'The action with the specified ID does not exists'
                })
            } else {
                res.json(actions)
            }
        })
        .catch()
})

router.post('/', (req, res) => {
    // console.log("post endpoint", req.body );
    const{project_id, description, notes, completed} = req.body
    // eslint-disable-next-line no-prototype-builtins
    if(!project_id || !description || !notes || ! req.body?.hasOwnProperty("completed") ){
        res.status(400).json({
            message: 'Please provide project_id, notes, description, or completed'
        })
    }else{
        Actions.insert({project_id, description, notes, completed})
        .then(({id}) =>{
            return Actions.get(id)
        })
        .then(post => {
            res.status(201).json(post)
        })
        .catch()
    }
})

router.put('/:id', (req, res) =>{
    const {project_id, description, notes, completed} = req.body
    // eslint-disable-next-line no-prototype-builtins
    if(!project_id || !description || !notes || ! req.body?.hasOwnProperty("completed") ){
        res.status(400).json({
            message: 'Please provide name, description, or completed'
        })
    } else {
        Actions.get(req.params.id)
        .then(post => {
            if(!post){
                res.status(404).json({
                    message: 'The project with the specified ID does not exists'
                })
            } else{
                return Actions.update(req.params.id, req.body)
            }
        })
        .then(data => {
            if(data){
                return Actions.get(req.params.id)
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

router.delete('/:id', async (req, res) => {
    try {
        const post = await Actions.get(req.params.id)
        if(!post){
            res.status(404).json({
                message: 'The project with the specified ID does not exist'
            }) 
        } else {
            await Actions.remove(req.params.id)
            res.json(post)
        }
    } catch (err) {
        res.status(500).json({
            message: "The project could not be removed",
            err: err.message, 
            stack: err.stack,
        })
    }
})


module.exports = router
