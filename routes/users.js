const {Router} = require("express");

const router = Router();

const { fsService } = require('../services');
const { usersValidator } = require("../validators");

//GET Users
router.get("/", async (req, res) => {
    try {
        const {users} = await fsService.reader()
        res.status(200).json(users)
    } catch (error) {
        res.status(400).json(error.message)
    }
})

// Get User by ID
router.get("/:id", async(req, res) => {
    try {
        const {id} = req.params;
        const {users} = await fsService.reader();
        const user = users.find(item => item.id === Number(id))
        
        if (!user) {
            throw new Error("User not found")
        } 

        res.status(200).json(user)
    } catch (error) {
        res.status(404).json({errors: [error.message]})
    }
})

// CREATE User
router.post("/", async(req, res) => {
    try {
        const {name: userName, email: userEmail} = req.body
 
        let { users, autoIncement} = await fsService.reader()

        const checkEmail = users.find(item => item.email === userEmail)

        if (!!checkEmail) {
            throw new Error("Email is already registered")
        }
        autoIncement++;

        const newUser = {
            id: autoIncement,
            name: userName,
            email: userEmail,
        }

        await fsService.writer({
            autoIncement, 
            users: [...users, newUser]
        })

        res.status(201).json(newUser)
    } catch (error) {
        res.status(404).json({errors: [error.message]})
    }
})

// UPDATE User
router.put('/:id', async(req, res) => {
    try {
        const { id } = req.params
        const {name, email} = req.body

        if (!("name" in req.body) || !("email" in req.body)) {
            throw new Error("Please name and email")
        }

        const {error} = usersValidator({name, email});
    
        if (error) {
            const dataErrors = error.details?.map(item => item.message)
            return res.status(400).json({errors: [...dataErrors]})
        }
        
        const {autoIncement, users} = await fsService.reader();

        const user = users.find(item => item.id === Number(id))
        
        if (!user) {
            throw new Error("User not found")
        }

        Object.assign(user, {name, email})

        await fsService.writer({
            autoIncement, 
            users
        })

    } catch (error) {
        res.status(404).json({errors: [error.message]})
    }
})


// DELETE User by ID
router.delete("/:id", async(req, res) => {
    try {
        const {id} = req.params;
        const users = await fsService.reader();
        const userIndex = users.findIndex(item => item.id === Number(id))
        
        if (userIndex === -1) {
            throw new Error("User not found")
        } 
        const newUsers = users.filter(item => item.id !== Number(id));
        await fsService.writer(newUsers);

        res.status(204)
    } catch (error) {
        res.status(404).json({errors: [error.message]})
    }
})


module.exports = router