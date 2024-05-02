import React, { useState } from 'react';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import $ from 'jquery';
import axios from 'axios';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';

const SignUp = () => {

    console.log("SignUp");

    const [renderCnt, setRenderCnt] = useState(0);
    const [dupli, setDupli] = useState(false);

    const history = useHistory();

    axios.defaults.headers.post['Content-Type'] = 'application/json;charset=EUC-KR';

    const doReset = () => {

        $('.id').val('');
        $('.pwd').val('');
        $('.pwd2').val('');
        $('.name').val('');
        $('.ssd').val('');
        $('.ssd2').val('');
        $('.address').val('');
        $('.phone1').val('010');
        $('.phone2').val('');
        $('.phone3').val('');
        $('.email').val('');

    };

    const checkDupli = async () => {

        let userId = $('.id').val();

        await axios.get("http://192.168.0.18:8000/react/user/checkDuplication/"+userId)
        .then((res) => {
            console.log(res);

            if(!res.data) {
                setDupli(true);
            }else {
                setDupli(false);
            }

        }).catch((err) => {
            console.log(err);
        });

    };

    const doSignUp = async () => {

        let id = $('.id').val();
        let pwd = $('.pwd').val();
        let pwd2 = $('.pwd2').val();
        let name = $('.name').val();
        let ssd = $('.ssd').val();
        let ssd2 = $('.ssd2').val();
        let address = $('.address').val();
        let phone = $('.phone1').val() + '-' + $('.phone2').val() + '-' + $('.phone3').val();
        let email = $('.email').val();

        if($('.id').val() == '') {
            alert("아이디를 입력해주세요");
            $('.id').focus();
            return;
        }

        if($('.pwd').val() == '' || $('.pwd2').val() == '') {
            alert("비밀번호를 입력해주세요");
            return;
        }else if($('.pwd').val() != $('.pwd2').val()) {
            alert("비밀번호를 확인해주세요");
            $('.pwd').focus();
            return;
        }

        if($('.name').val() == '') {
            alert("이름을 입력해주세요");
            $('.name').focus();
            return;
        }

        if($('.ssd').val() == '' || $('.ssd2') == '') {
            alert("주민번호를 입력해주세요");
            $('.ssd').focus();
            return;
        }else {
            ssd = $('.ssd').val() + $('.ssd2').val();
        }

        if($('.address').val() == '') {
            alert("주소를 입력해주세요");
            $('.address').focus();
            return;
        }

        if($('.phone2').val() == '' || $('.phone3').val() == '') {
            alert("전화번호를 입력해주세요");
            $('.phone2').focus();
            return;
        }else {
            phone = $('.phone1').val() + '-' + $('.phone2').val() + '-' + $('.phone3').val();
        }

        if($('.email').val() == '') {
            alert("이메일을 입력해주세요");
            $('email').focus();
            return;
        }

        await axios.post("http://192.168.0.18:8000/react/user/addUser", {
            userId:id,
            password:pwd,
            userName:name,
            ssd:ssd,
            addr:address,
            phone:phone,
            email:email
        }).then((res) => {
            console.log(res);
        }).catch((err) => {
            console.log(err);
        })

        history.push('/');

    };

    return (
        <>
            <Container>
                <h3 class=" text-info">회원가입</h3>
            
                <br/><br/>

                <Form.Group as={Row} >
                        <Form.Label column sm={3} className="col-sm-offset-1 control-label">아 이 디</Form.Label>
                        <Col sm={4}>
                            <Form.Control className='id' onKeyUp={() => { checkDupli() }} defaultValue='' type="text" placeholder='아이디' />
                            <Form.Text hidden={!dupli} className="text-danger">해당 아이디 사용 불가</Form.Text>
                        </Col>
                </Form.Group>

                <br/>

                <Form.Group as={Row} controlId="password">
                    <Form.Label column sm={3} className="col-sm-offset-1 control-label">비밀번호</Form.Label>
                    <Col sm={4}>
                        <Form.Control className='pwd' defaultValue='' type="password" placeholder="비밀번호" />
                    </Col>
                </Form.Group>

                <br/>

                <Form.Group as={Row} controlId="password2">
                    <Form.Label column sm={3} className="col-sm-offset-1 control-label">비밀번호 확인</Form.Label>
                    <Col sm={4}>
                        <Form.Control className='pwd2' defaultValue='' type="password" placeholder="비밀번호" />
                    </Col>
                </Form.Group>

                <br/>


                <Form.Group as={Row} controlId="userName">
                    <Form.Label column sm={3} className="col-sm-offset-1 control-label">이름</Form.Label>
                    <Col sm={4}>
                        <Form.Control className='name' defaultValue='' type="text" placeholder="회원이름" />
                    </Col>
                </Form.Group>

                <br/>

                <Form.Group as={Row} controlId="ssd">
                    <Form.Label column sm={3} className="col-sm-offset-1 control-label">주민번호</Form.Label>
                    <Col sm={2}>
                        <Form.Control className='ssd' defaultValue='' type="text" placeholder="생년월일" />
                    </Col>
                    <Col sm={2}>
                        <Form.Control className='ssd2' defaultValue='' type="password" placeholder="주민번호" />
                    </Col>
                </Form.Group>

                <br/>

                <Form.Group as={Row} controlId="addr">
                    <Form.Label column sm={3} className="col-sm-offset-1 control-label">주소</Form.Label>
                    <Col sm={4}>
                        <Form.Control className='address' defaultValue='' type="text" placeholder="주소" />
                    </Col>
                </Form.Group>

                <br/>

                <Form.Group as={Row} controlId="phone">
                    <Form.Label column sm={3} className="col-sm-offset-1 control-label">휴대전화번호</Form.Label>
                    <Col sm={2}>
                        <Form.Select className='phone1' aria-label="Default select example">
                            <option value="010" defaultChecked >010</option>
                            <option value="011">011</option>
                            <option value="016">016</option>
                            <option value="018">018</option>
                            <option value="019">019</option>
                        </Form.Select>
                    </Col>
                    <Col sm={2}>
                        <Form.Control className='phone2' defaultValue='' type="text" placeholder="전화번호" />
                    </Col>
                    <Col sm={2}>
                        <Form.Control className='phone3' defaultValue='' type="text" placeholder="전화번호" />
                    </Col>
                </Form.Group>

                <br/>

                <Form.Group as={Row} controlId="email">
                    <Form.Label column sm={3} className="col-sm-offset-1 control-label">이메일</Form.Label>
                    <Col sm={4}>
                        <Form.Control className='email' defaultValue='' type="text" placeholder="이메일" />
                    </Col>
                </Form.Group>

                <br/>

                <Form.Group as={Row}>
                    <Col sm={{ span: 6, offset: 2 }} className="text-center">
                        <Button variant="primary" disabled={dupli} onClick={() => {doSignUp()}} >회원가입</Button>
                        &nbsp;
                        <Button variant="primary" onClick={() => doReset()} >취소</Button>
                    </Col>
                </Form.Group>

            </Container>

        </>
    );
};

export default SignUp;