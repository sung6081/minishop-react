import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Button, Col, Container, Row, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { useLocation } from 'react-router-dom/cjs/react-router-dom.min';

const GetUser = () => {

    console.log("GetUser");

    const [user, setUser] = useState([]);

    const [cookies, setCookie] = useCookies('userId');

    const location = useLocation();
    const receivdData = location.state.userId;

    const getUser = async () => {

        await axios.get("http://192.168.0.18:8000/react/user/getUser/"+receivdData)
            .then((res) => {
                setUser(res.data);
                console.log(res);
            })
            .catch((err) => {
                console.log(err);
            });

    };

    useEffect(() => {

        getUser();

    }, []);

    return (
        <>

            <Container>

                <div class="page-header">
                    <h3 class=" text-info">회원정보조회</h3>
                </div>
                <br/>

                <Row>
                    <Col xs={4} md={2}><strong>아 이 디</strong></Col>
                    <Col xs={8} md={4}>{user.userId}</Col>
                </Row>

                <hr/>

                <Row>
                    <Col xs={4} md={2}><strong>이 름</strong></Col>
                    <Col xs={8} md={4}>{user.userName}</Col>
                </Row>

                <hr/>

                <Row>
                    <Col xs={4} md={2}><strong>주소</strong></Col>
                    <Col xs={8} md={4}>{user.addr}</Col>
                </Row>

                <hr/>

                <Row>
                    <Col xs={4} md={2}><strong>휴대전화번호</strong></Col>
                    <Col xs={8} md={4}>{user.phone}</Col> {/* user.phone이 없을 때를 처리하기 위해 조건부 렌더링 사용 */}
                </Row>

                <hr/>

                <Row>
                    <Col xs={4} md={2}><strong>이 메 일</strong></Col>
                    <Col xs={8} md={4}>{user.email}</Col>
                </Row>

                <hr/>

                <Row>
                    <Col xs={4} md={2}><strong>가입일자</strong></Col>
                    <Col xs={8} md={4}>{user.regDate}</Col>
                </Row>

                <br/>

                <Row className="justify-content-center" >
                    <Col xs="auto" >
                        <Button variant="primary" size="lg" ><Link to={{pathname:'./UpdateUser', state:{userId: user.userId}}} style={{ textDecoration: "none", color:'white' }} >회원정보수정</Link></Button>
                    </Col>
                </Row>

            </Container>
        </>
    );
};

export default GetUser;