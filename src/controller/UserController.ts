import { Contorller } from "../abstract/Contorller";
import { Request, Response } from "express";
import { UserService } from "../Service/UserService";
import { resp } from "../utils/resp";
import { DBResp } from "../interfaces/DBResp";
import { Student } from "../interfaces/Student";
require('dotenv').config();

export class UserController extends Contorller {
    protected service: UserService;

    constructor() {
        super();
        this.service = new UserService();
    }

    public async findAll(req: Request, res: Response) {
        const result: resp<Array<DBResp<Student>> | undefined> = {
            code: 200,
            message: "",
            body: undefined
        };

        const dbResp = await this.service.getAllStudents();
        if (dbResp) {
            result.body = dbResp;
            result.message = "Find success";
            res.send(result);
        } else {
            result.code = 500;
            result.message = "Server error";
            res.status(500).send(result);
        }
    }

    public async insertOne(req: Request, res: Response) {
        const resp = await this.service.insertOne(req.body);
        res.status(resp.code).send(resp);
    }

    public async deleteById(req: Request, res: Response) {
        try {
            const id = req.params.id;
            if (!id) {
                return res.status(400).send({
                    code: 400,
                    message: "Missing required parameter: id",
                });
            }
            const result = await this.service.deleteById(id);
            res.status(result.code).send(result);
        } catch (err) {
            console.error("Error:", err);
            return res.status(500).send({
                code: 500,
                message: "Internal Server Error",
            });
        }
    }

    public async updateNameByID(req: Request, res: Response) {
        const id = req.params.id;
        const name = req.body.name;
        const result = await this.service.updateNameByID(id, name);
        res.status(result.code).send(result);
    }
}
