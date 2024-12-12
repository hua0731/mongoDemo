import { Route } from "../abstract/Route";
import { UserController } from "../controller/UserController";
import { logger } from "../middlewares/log";

export class UserRoute extends Route {
    
    protected url: string;
    protected Contorller = new UserController();

    constructor() {
        super();
        this.url = '/api/v1/user/';
        this.setRoutes();
    }

    protected setRoutes(): void {
        
        this.router.get(`${this.url}findAll`, (req: any, res: any) => {
            this.Contorller.findAll(req, res);
        });

        // 新增學生
        this.router.post(`${this.url}insertOne`, (req: any, res: any) => {
            this.Contorller.insertOne(req, res);
        });

        // 刪除學生
        this.router.delete(`${this.url}deleteById/:id`, (req: any, res: any) => { // 使用 path 參數
            this.Contorller.deleteById(req, res);
        });

        // 更新學生姓名
        this.router.put(`${this.url}updateNameByID/:id`, (req: any, res: any) => { // 使用 path 參數
            this.Contorller.updateNameByID(req, res);
        });
    }
}
