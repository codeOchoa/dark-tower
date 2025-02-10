import { Router } from 'express';
import { paramsValidator } from '../middlewares/params-validator.js';
import { userValidator, userRoleValidate } from '../middlewares/user-validator.js';
import { manager } from '../managers/user-manager.js';
import { uploader } from '../middlewares/multer.js';

const router = Router();

router.get('/', userRoleValidate, async (req, res, next) => {
    try {
        const { limit } = req.query;
        const users = await manager.getAllUsers(limit);
        return res.json(users);
    } catch (error) {
        next(error);
    }
});

router.get('/:id', [paramsValidator], async (req, res, next) => {
    try {
        const { id } = req.params;
        const user = await manager.getUserByid(id);
        return res.json(user);
    } catch (error) {
        next(error);
    }
});

router.post('/', uploader.single('image'), async (req, res, next) => {
    // console.log(req)
    try {
        const user = await manager.createUser({
            ...req.body,
            image: req.file.path
        });
        return res.status(201).json({ id: user.id, email: user.email });
    } catch (error) {
        next(error);
    }
});

router.delete('/:id', [paramsValidator], async (req, res, next) => {
    try {
        const { id } = req.params;
        const userDel = await manager.deleteUser(id);
        return res
            .status(200)
            .json({ message: `User delete ok - id: ${userDel.id}` });
    } catch (error) {
        next(error);
    }
});

router.put('/:id', [paramsValidator, userValidator], async (req, res, next) => {
    try {
        const { id } = req.params;
        const userUpd = await manager.updateUser(req.body, id);
        return res.status(200).json(userUpd);
    } catch (error) {
        next(error);
    }
});

export default router;
