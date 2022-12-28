import express from "express";
import cors from 'cors';
import route from "./src/user/user.route";
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import swaggerJsDoc from 'swagger-jsdoc';
import swagerUi from 'swagger-ui-express';
import mongoose from 'mongoose';
let password = process.env.password;
import bodyParser from "body-parser";
const app = express();
app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(bodyParser.json());
app.use(route);
const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Node JS API Project for mongodb',
            version: '1.0.0',
            description: 'Node JS API Project for mongodb'
        },
        servers: [
            {
                url: 'http://localhost:9002'
            }
        ]
    },
    apis: ['./index.js']
};
const swaggerSpec = swaggerJsDoc(options);
app.use('/api-docs', swagerUi.serve, swagerUi.setup(swaggerSpec));
/**
 * @swagger
 * /user/register:
 *   post:
 *      summary: Returns the list of all the some
 *      tags: [AUTH]
 *      description: Optional description in Markdown
 *      required: true
 *      requestBody:
 *         required: true
 *         content:
 *              application/json:
 *                schema:
 *                 type: object
 *                 properties:
 *                      userinfo:
 *                          type: object
 *                          properties:
 *                             name:
 *                               type: string
 *                             email:
 *                               type: string
 *                             password:
 *                               type : string
 *
 *      responses:
 *        201:
 *          description: The list of all the some
 *          content:
 *            application/json:
 *              schema:
 *                 type: object
 *        400:
 *          description: Either name, email or password does not fulfill the requiremet
 *          content:
 *            application/json:
 *              schema:
 *                 type: object
 *
 */
/**
 * @swagger
 * /user/signin:
 *   post:
 *      summary: Returns the token
 *      tags: [AUTH]
 *      description: Optional description in Markdown
 *      required: true
 *      requestBody:
 *         required: true
 *         content:
 *            application/json:
 *                schema:
 *                 type: object
 *                 properties:
 *                      userinfo:
 *                          type: object
 *                          properties:
 *                             email:
 *                               type: string
 *                             password:
 *                               type : string
 *      responses:
 *        201:
 *          description: Signed in Successfully
 *          content:
 *            application/json:
 *              schema:
 *                 type: object
 *        404 :
 *          description : Either email or Password does not match
 *          content:
 *            application/json:
 *              schema:
 *                 type: object
 *        400:
 *          description: Either email or password does not fulfill the requiremet
 *          content:
 *            application/json:
 *              schema:
 *                 type: object
 */
/**
 * @swagger
 * /user/update:
 *   put:
 *      summary: Returns the user
 *      tags: [AUTH]
 *      description: Optional description in Markdown
 *      required: true
 *      parameters:
 *         - name: auth
 *           in: header
 *           description: an authorization header
 *           required: true
 *           type: string
 *      requestBody:
 *         required: true
 *         content:
 *            application/json:
 *                schema:
 *                 type: object
 *                 properties:
 *                      userinfo:
 *                          type: object
 *                          properties:
 *                             password:
 *                               type : string
 *      responses:
 *        200:
 *          description: SPassword successfully updated
 *          content:
 *            application/json:
 *              schema:
 *                 type: object
 *
 */
let port = process.env.PORT || 8080;
mongoose.connect(`mongodb+srv://${process.env.USER_NAME}:${password}@cluster0.v9hmghu.mongodb.net/f22users`)
    .then(() => {
    console.log("Connected to Database");
    app.listen(port, () => {
        console.log(`Server is running at ${port}`);
    });
})
    .catch(() => {
    console.log('error in connecting to database');
});
export { app };
