import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Button, Col, Container, Form, Modal, Row } from 'react-bootstrap';
import { useHistory, useLocation } from 'react-router-dom/cjs/react-router-dom.min';
import $ from 'jquery';

const UpDateUser = () => {

    console.log("UpdateUser");

    const location = useLocation();
    const receivdData = location.state.userId;
    const history = useHistory();

    axios.defaults.headers.post['Content-Type'] = 'application/json;charset=EUC-KR';

    const [user, setUser] = useState([]);
    const [show, setShow] = useState(false);
    const [renderCnt, setRenderCnt] = useState(0);

    const handleClose = () => { setShow(false) };
    const handleShow = () => setShow(true);

    const loadUser = async () => {

        await axios.get("http://192.168.0.18:8000/react/user/getUser/"+receivdData)
            .then((res) => {
                setUser(res.data);
                console.log(res);
            })
            .catch((err) => {
                console.log(err);
            });

    };

    const doUpdate = async () => {

        console.log("doUpdate");

        let pwd = user.password;
        let phone = user.phone;
        let addr = user.addr;
        let email = user.email;
        let name = user.userName;

        if($('.pwd').val() == '' && $('.checkPwd').val() == '') {

        }else if($('.pwd').val() == '' || $('.checkPwd').val() == '') {
            setShow(true);
            return;
        }else if($('.pwd').val() != $('.checkPwd').val()){

            setShow(true);
            return;

        }else if($('.pwd').val() == $('.checkPwd').val()) {
            pwd = $('.pwd').val();
        }

        if($('.phone2').val() == '' || $('.phone3').val() == '') {
            alert("전화번호를 입력해주세요.");
        }
        else if($('.phone2').val() != '' && $('.phone3') != ''){
            phone = $('.phone1').val() + '-' + $('.phone2').val() + '-' + $('.phone3').val();
            console.log("phone : "+phone);
        }

        if($('.name').val() == '') {
            alert("이름을 입력해주세요");
            $('.name').focus();
            return;
        }else {
            name = $('.name').val();
        }

        if($('.address').val() == '') {
            alert("주소를 입력해주세요");
            $('.address').focus();
            return;
        }else {
            addr = $('.address').val();
        }

        if($('.email').val() == '') {
            alert("이메일을 입력해주세요");
            $('.email').focus();
            return;
        }else {
            email = $('.email').val();
        }

        await axios.post("http://192.168.0.18:8000/react/user/updateUser", {
            userId:user.userId,
            password:pwd,
            phone:phone,
            addr:addr,
            email:email,
            userName:name
        }).then((res) => {
            history.goBack();
        }).catch((err) => {
            console.log(err);
        });

    };

    useEffect(() => {
        loadUser();
    }, []);

    return (
        <>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                <Modal.Title>Password Wrong!</Modal.Title>
                </Modal.Header>
                <Modal.Body>비밀번호 입력을 다시 해주세요</Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                </Modal.Footer>
            </Modal>

            <Container>
                <div class="page-header text-center">
                    <h3 class=" text-info">회원정보수정</h3>
                </div>
            </Container>

            <Container>
                <Form.Group as={Row} >
                        <Form.Label column sm={3} className="col-sm-offset-1 control-label">아 이 디</Form.Label>
                        <Col sm={4}>
                            <Form.Control type="text" defaultValue={user.userId} readOnly />
                            <Form.Text className="text-danger">아이디는 수정불가</Form.Text>
                        </Col>
                </Form.Group>

                <br/>

                <Form.Group as={Row} controlId="password">
                    <Form.Label column sm={3} className="col-sm-offset-1 control-label">비밀번호</Form.Label>
                    <Col sm={4}>
                        <Form.Control className='pwd' type="password" placeholder="변경비밀번호" />
                    </Col>
                </Form.Group>

                <br/>

                <Form.Group as={Row} controlId="password2">
                    <Form.Label column sm={3} className="col-sm-offset-1 control-label">비밀번호 확인</Form.Label>
                    <Col sm={4}>
                        <Form.Control className='checkPwd' type="password" placeholder="변경비밀번호 확인" />
                    </Col>
                </Form.Group>

                <br/>

                <Form.Group as={Row} controlId="userName">
                    <Form.Label column sm={3} className="col-sm-offset-1 control-label">이름</Form.Label>
                    <Col sm={4}>
                        <Form.Control className='name' type="text" defaultValue={user.userName} placeholder="변경회원이름" />
                    </Col>
                </Form.Group>

                <br/>

                <Form.Group as={Row} controlId="addr">
                    <Form.Label column sm={3} className="col-sm-offset-1 control-label">주소</Form.Label>
                    <Col sm={4}>
                        <Form.Control className='address' type="text" defaultValue={user.addr} placeholder="변경주소" />
                    </Col>
                </Form.Group>

                <br/>

                <Form.Group as={Row} controlId="phone">
                    <Form.Label column sm={3} className="col-sm-offset-1 control-label">휴대전화번호</Form.Label>
                    <Col sm={2}>
                        <Form.Select className='phone1' aria-label="Default select example">
                            <option value="010">010</option>
                            <option value="011">011</option>
                            <option value="016">016</option>
                            <option value="018">018</option>
                            <option value="019">019</option>
                        </Form.Select>
                    </Col>
                    <Col sm={2}>
                        <Form.Control className='phone2' type="text" defaultValue={user.phone2} placeholder="변경번호" />
                    </Col>
                    <Col sm={2}>
                        <Form.Control className='phone3' type="text" defaultValue={user.phone3} placeholder="변경번호" />
                    </Col>
                </Form.Group>

                <br/>

                <Form.Group as={Row} controlId="email">
                    <Form.Label column sm={3} className="col-sm-offset-1 control-label">이메일</Form.Label>
                    <Col sm={4}>
                        <Form.Control className='email' type="text" defaultValue={user.email} placeholder="변경이메일" />
                    </Col>
                </Form.Group>

                <br/>

                <Form.Group as={Row}>
                    <Col sm={{ span: 6, offset: 2 }} className="text-center">
                        <Button variant="primary" onClick={() => doUpdate()} >수정</Button>
                        &nbsp;
                        <Button variant="primary" onClick={() => setRenderCnt(renderCnt + 1)} >취소</Button>
                    </Col>
                </Form.Group>

            </Container>
        </>
    );
};

export default UpDateUser;