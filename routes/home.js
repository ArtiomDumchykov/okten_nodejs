const { Router } = require("express")
const router = Router();

router.get('/', (req,res) => {
    res.status(200).send("<h1>Hello World</h1>")
})

module.exports = router