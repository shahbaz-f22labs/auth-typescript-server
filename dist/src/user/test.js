process.env.NODE_ENV = 'test';
import chai from 'chai';
import chaiHttp from 'chai-http';
import { app } from '../../index';
chai.use(chaiHttp);
let token;
/*
  * Test the /POST route
  */
describe('/POST user', () => {
    it('it can POST a book without pages field', (done) => {
        let user = {
            name: "abc",
            email: "abc@gmail.com",
            password: "a1@S1234"
        };
        chai.request(app)
            .post('/user/register')
            .send({ userinfo: user })
            .end((err, res) => {
            let errorResponse = res.text;
            let parsedErrorResponse = JSON.parse(errorResponse);
            console.log(parsedErrorResponse.error);
            res.should.have.status(201);
            res.body.should.be.a('object');
            res.body.message.should.be.eql("User created");
            done();
        });
    });
});
describe('/POST user', () => {
    it('it is for login', (done) => {
        let user = {
            email: "sita@gmail.com",
            password: "a1@S1234"
        };
        chai.request(app)
            .post('/user/signin')
            .send({ userinfo: user })
            .end((err, res) => {
            let errorResponse = res.text;
            let parsedErrorResponse = JSON.parse(errorResponse);
            console.log(parsedErrorResponse.error);
            if (parsedErrorResponse.token) {
                token = parsedErrorResponse.token;
                console.log(parsedErrorResponse.token);
            }
            res.should.have.status(201);
            res.body.should.be.a('object');
            done();
        });
    });
});
describe('/update user', () => {
    it('it is for updating', (done) => {
        let user = {
            password: "a1@S1234"
        };
        chai.request(app)
            .put('/user/update')
            .set({ 'token': token })
            .send({ userinfo: user })
            .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            let errorResponse = res.text;
            let parsedErrorResponse = JSON.parse(errorResponse);
            console.log(parsedErrorResponse.error);
            done();
        });
    });
});
