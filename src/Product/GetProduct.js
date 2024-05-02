import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Button, Carousel, Col, Container, Row } from 'react-bootstrap';
import { useCookies } from 'react-cookie';
import { useHistory, useLocation } from 'react-router-dom/cjs/react-router-dom';

const GetProduct = () => {

    console.log("GetProduct");

    const location = useLocation();
    const [product, setProduct] = useState([]);
    const [fileList, setFileList] = useState([]);
    const [cookies, setCookie] = useCookies('role');
    const history = useHistory();
    const receivdData = location.state.prodNo;

    const getProduct = async () => {

        await axios.get("http://192.168.0.18:3000/react/product/getProduct/"+receivdData)
            .then((res) => {
                console.log(res);
                setProduct(res.data);
                setFileList(res.data.files);
            }).catch((err) => {
                console.log(err);
            });

    };

    useEffect(() => {

        getProduct();

    }, []);

    return (
        <>

            <Container>

                <div class="page-header">
                    <h3 class=" text-info">회원정보조회</h3>
                </div>
                <br/>

                <Row>
                    <Col xs={4} md={2}><strong>상품명</strong></Col>
                    <Col xs={8} md={4}>{product.prodName}</Col>
                </Row>

                <hr/>

                <Row>
                    <Col xs={4} md={2}><strong>가격</strong></Col>
                    <Col xs={8} md={4}>{product.price}</Col>
                </Row>

                <hr/>

                <Row>
                    <Col xs={4} md={2}><strong>상세정보</strong></Col>
                    <Col xs={8} md={4}>{product.prodDetail}</Col>
                </Row>

                <hr/>

                <Row>
                    <Col xs={4} md={2}><strong>제조일자</strong></Col>
                    <Col xs={8} md={4}>{product.manuDate}</Col> {/* user.phone이 없을 때를 처리하기 위해 조건부 렌더링 사용 */}
                </Row>

                <hr/>

                <Row>
                    <Col xs={4} md={2}><strong>이미지</strong></Col>
                    <Col xs={8} md={4}>
                        <Carousel data-bs-theme="dark" >
                                {fileList.map((file, index) => (
                                        <Carousel.Item key={index} interval={5000}>
                                            <img className='d-block w-100' src={"http://192.168.0.18:8000/images/uploadFiles/" + file.fileName}  />
                                        </Carousel.Item>
                                    ))}
                        </Carousel>
                    </Col>
                </Row>

                <hr/>

                <Row>
                    <Col xs={4} md={2}><strong>등록일자</strong></Col>
                    <Col xs={8} md={4}>{product.regDate}</Col>
                </Row>

                <br/>

                <Row className="justify-content-center" >
                    <Col xs="auto" >
                        { location.state.menu == 'manage' ? (<Button variant="primary" size="lg" >수정</Button>) : '' }
                        { location.state.menu == 'search' && cookies.role == 'user' ? (<Button variant="primary" size="lg" >구매</Button>) : '' }
                        &nbsp;<Button onClick={() => history.goBack()} variant="primary" size="lg" >확인</Button>
                    </Col>
                </Row>

            </Container>
        </>
    );
};

export default GetProduct;