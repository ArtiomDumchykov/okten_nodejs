import {Request, Response, Router} from 'express';

const router = Router();

router.get("/", async(req: Request,res: Response) => {
    res.status(200).send("<h1>Hello World</h1>");
})

export const homeRoutes = router;