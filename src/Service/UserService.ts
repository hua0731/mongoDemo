import { Service } from "../abstract/Service";
import { Student } from "../interfaces/Student";
import { logger } from "../middlewares/log";
import { studentsModel } from "../orm/schemas/studentSchemas";
import { Document } from "mongoose";
import { MongoDB } from "../utils/MongoDB";
import { DBResp } from "../interfaces/DBResp";
import { resp } from "../utils/resp";

type seatInfo = {
    schoolName: string;
    department: string;
    seatNumber: string;
};

export class UserService extends Service {
    
    // 定義 userNameValidator 方法來驗證學生名稱
    public async userNameValidator(name: string): Promise<string> {
        // 如果名稱為空或是空白
        if (!name || name.trim().length === 0) {
            return "名稱不得為空";
        }
        // 這裡可以根據需要擴展更多驗證規則，比如名稱長度、格式等
        if (name.length < 2) {
            return "名稱長度不能小於2個字符";
        }
        return "驗證通過";
    }

    public async getAllStudents(): Promise<Array<DBResp<Student>> | undefined> {
        try {
            const res: Array<DBResp<Student>> = await studentsModel.find({});
            return res;
        } catch (error) {
            return undefined;
        }
    }

    /**
     * 新增學生
     * @param info 學生資訊
     * @returns resp
     */
    public async insertOne(info: Student): Promise<resp<DBResp<Student> | undefined>> {
        const current = await this.getAllStudents();
        const resp: resp<DBResp<Student> | undefined> = {
            code: 200,
            message: "",
            body: undefined,
        };

        if (current && current.length > 0) {
            try {
                const nameValidator = await this.userNameValidator(info.userName);  // 調用驗證方法
                if (current.length >= 200) {
                    resp.message = "student list is full";
                    resp.code = 403;
                } else {
                    if (nameValidator === "驗證通過") {
                        info.sid = String(current.length + 1);
                        info._id = undefined;
                        const res = new studentsModel(info);
                        resp.body = await res.save(); // Save to database
                    } else {
                        resp.code = 403;
                        resp.message = nameValidator;
                    }
                }
            } catch (error) {
                resp.message = "server error";
                resp.code = 500;
            }
        } else {
            resp.message = "server error";
            resp.code = 500;
        }

        return resp;
    }

    // 刪除學生
    public async deleteById(id: string) {
        const resp: resp<any> = {
            code: 200,
            message: "",
            body: undefined,
        };
        try {
            const res = await studentsModel.deleteOne({ _id: id });
            resp.message = "success";
            resp.body = res;
        } catch (error) {
            resp.message = error as string;
            resp.code = 500;
        }
        return resp;
    }

    // 更新學生姓名
    public async updateNameByID(id: string, name: string) {
        const resp: resp<DBResp<Student> | undefined> = {
            code: 200,
            message: "",
            body: undefined,
        };

        const user = await studentsModel.findById(id);
        if (user) {
            try {
                user.name = name;
                await user.save();
                resp.body = user;
                resp.message = "update success";
            } catch (error) {
                resp.code = 500;
                resp.message = "server error";
            }
        } else {
            resp.code = 404;
            resp.message = "user not found";
        }
        return resp;
    }
}
