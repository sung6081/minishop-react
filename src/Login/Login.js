import React, { useState } from 'react';
import $ from 'jquery';
import axios from 'axios';
import { Container, Form, Button, InputGroup, Modal } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import { useCookies } from 'react-cookie';

const Login = () => {

    console.log("Login");

    const [cookies, setCookie, removeCookie] = useCookies(['user']);
    const [show, setShow] = useState(false);

    const handleClose = () => { setShow(false) };
    const handleShow = () => setShow(true);

    const history = useHistory();

    const login = async (id, pwd) => {

        await axios.post("http://192.168.0.18:8000/react/user/login", {
            userId:id,
            password:pwd
        })
            .then((res) => {

                //console.log(res);
                //console.log(res.data);

                if(res.data != '') {
                    setCookie('userId', res.data.userId, {path: '/'});
                    setCookie('role', res.data.role, {path: '/'});

                    //history.push('/');
                    window.location.href = '/';

                }else {
                    setShow(true);
                    return;
                }

            })
            .catch((err) => {
                console.log(err);
            });

    }

    const doLogin = () => {

        //console.log($('.userId').val());
        //console.log($('.password').val());

        if($('.userId').val() == '') {
            alert("아이디를 입력해주세요.");
            $('.userId').focus();
            return;
        }

        if($('.password').val() == '') {
            alert("password를 입력해주세요.");
            $('.password').focus();
            return;
        }

        let id = $('.userId').val();
        let pwd = $('.password').val();

        login(id, pwd);

    }

    return (
        <>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                <Modal.Title>로그인 실패!</Modal.Title>
                </Modal.Header>
                <Modal.Body>아이디나 비밀번호를 확인해주세요</Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                </Modal.Footer>
            </Modal>
        
            <Container fluid className="d-flex align-items-center justify-content-center py-4 bg-body-tertiary">
                <main className="form-signin text-center">
                    <form>
                    <img className="mb-4" src="/minishop_img.png" alt=""  />

                    <Form.Group className="mb-3" controlId="email">
                        <Form.Label>아이디</Form.Label>
                        <InputGroup>
                        <Form.Control className='userId' type="email" placeholder="아이디" name="email" />
                        </InputGroup>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="password">
                        <Form.Label>비밀번호</Form.Label>
                        <InputGroup>
                        <Form.Control className='password' type="password" placeholder="비밀번호" name="password" />
                        </InputGroup>
                    </Form.Group>

                    <Button variant="primary" className="w-100 py-2" onClick={doLogin} >Sign in</Button>
                    <p className="mt-5 mb-3 text-body-secondary">&copy; 2024</p>
                    </form>
                </main>
            </Container>
        </>
        
    );
};

export default Login;