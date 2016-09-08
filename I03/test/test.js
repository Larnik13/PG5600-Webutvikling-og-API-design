var api = require('../server/api.js');
var express = require('express');
var request = require('supertest');
var chai = require('chai');
var expect = chai.expect;

const app = express();

describe('GET /all/messages', () => {
    it('should return a JSON array', done => {
        app.use(api);
        request(app).get('/all/messages')
        .expect(200)
        .expect('Content-Type', /text/)
        .expect(res => {
            expect(res.body).to.be.instanceOf(Object);
        })
        .end(done);

    });
});

const registerAccount = (username, password, callback) => request(app).post('/register').type('json').send(JSON.stringify({email: username, password: password})).expect(callback);

const login = (username, password, callback) => request(app).post('/login').type('json').send(JSON.stringify({email: username, password: password})).expect(callback);

const addMessage = (text, isPublic, uploader, callback) => request(app).post('/' + uploader + '/messages').type('json').send(JSON.stringify({uploader: uploader, text: text, isPublic: isPublic})).expect(callback);

describe('GET /message/:id', () => {
    it('should return a message', (done) => {
        app.use(api);
        console.log(1);
        registerAccount('test', 'test').end(() => {
            console.log(2);
            var token;
            var username = 'test';
            var password = username;
            var id;
            request(app).post('/login').type('json')
                .send(JSON.stringify({email: username, password: password}))
                .expect(res => token = res.body)
                .end((res) => {
                    console.log(3);
                    console.log(4);
                    request(app).post('/' + username + '/messages')
                        .type('json')
                        .send(JSON.stringify({uploader: username, text: 'testTExt', isPublic: false}))
                        .expect(res => id = res.body)
                        .end((res) => {
                            console.log(4);
                            request(app).get('/message/' + id)
                                .set('x-access-token', token)
                                .expect(200)
                                .expect(res => {
                                    expect(res).to.have.property('text');
                                })
                                .end(done);
                        });
                });
        });
    });
});