import axios from 'axios';
import React from 'react';
import './Home.css';
import { Container, Carousel, Row, Col, Button, Card } from 'react-bootstrap';
import { useCookies } from 'react-cookie';
import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import $ from 'jquery';
import { Link, useHistory, useLocation } from 'react-router-dom/cjs/react-router-dom';

const Home = () => {

    console.log("Home");

    const history = useHistory();
    const location = useLocation();

    const [currentPage, setCurrentPage] =useState(1);

    //const [cookies, setCookie] = useCookies(['user']);

    const [fileList, setFileList] = useState([]);
    const [productList, setProductList] = useState([]);
    const [ref, inView] = useInView();

    //console.log("cookie.userId : "+cookies.userId);
    //console.log("cookie.role : "+cookies.role);

    const loadCarousel = async () => {

        await axios.get("http://192.168.0.18:8000/react/product/homeCarousel")
            .then((res) => {

                //console.log(res);
                setFileList(res.data);

            })
            .catch((err) => {
                console.log(err);
            }).data

    }

    const loadProduct = async () => {

        console.log("loadProduct");

        await axios.get("http://192.168.0.18:8000/react/product/homeProductList/1")
            .then((res) => {

                console.log(res);
                setProductList(res.data.list);

            })
            .catch((err) => {
                console.log(err);
            }).data

    }

    const appendProductList = async () => {

        console.log("currentPage : "+currentPage);

        axios.get("http://192.168.0.18:8000/react/product/homeProductList/"+currentPage)
            .then((res) => {
                
                if(currentPage > res.data.resultPage.maxPage) {
                    console.log("totalCount : "+res.data.resultPage.maxPage);
                    console.log("currentPage : "+currentPage);
                    return;
                } 

                setProductList([...productList, ...res.data.list]);

                setCurrentPage(currentPage+1);
                console.log(res.data);
                console.log("\n");
            })
            .catch((err) => {
                console.log(err);
            });

    }

    useEffect(() => {

        loadCarousel();
        loadProduct();
        setCurrentPage(2);

    }, []);

    useEffect(() => {

        if(inView) {
            appendProductList();
        }

    }, [inView]);

    useEffect(() => {
        const unlisten = history.listen(() => {
            loadCarousel();
            loadProduct();
            setCurrentPage(2);
        });
        return () => unlisten();
    }, [history, location]);

    //console.log("fileList:", fileList);
    //console.log("productList:", productList);

    // $(document).scroll( async () => {
        
    //     var scrollPostion = $(window).scrollTop();
    //     console.log(scrollPostion);

    //     if(scrollPostion >= $('.productList').height()) {
            
    //         await appendProductList();
    //     }

    // })

    return (
        <>
            <Container className='container' >
                <img className='logo' src='/minishop_img.png' />
            </Container>

            <Carousel data-bs-theme="dark" className="border border-dark rounded" >
                    {fileList.map((file, index) => (
                            <Carousel.Item key={index} interval={5000}>
                                <img className='d-block w-100' src={"http://192.168.0.18:8000/images/uploadFiles/" + file.fileName}  />
                            </Carousel.Item>
                        ))}
            </Carousel>

            <Container id='productList' >
                <h5>Product List</h5>
            
                <Row>
                    {
                        productList.map((product, index) => {
                                
                            return (
                                    <React.Fragment>
                                            <Col>
                                                <Card style={{ width: '18rem' }}>
                                                    <Card.Img variant="top" src={"http://192.168.0.18:8000/images/uploadFiles/" + product.files[0].fileName} />
                                                    <Card.Body>
                                                    <Card.Title>{product.prodName}</Card.Title>
                                                    <Card.Text>
                                                        가격 : {product.price}
                                                    </Card.Text>
                                                    <Button variant="primary"><Link to={{pathname:'/Product/GetProduct', state:{prodNo: product.prodNo, menu:""}}} style={{"color":"white"}} >상세정보 보기</Link></Button>
                                                    </Card.Body>
                                                </Card>
                                            </Col>
                                            { (index+1)%3 == 0 ? <Container><br/></Container> : '' }
                                    </React.Fragment>
                            )

                        })
                    }
                </Row>
            </Container>

            <Container ref={ref} >
                <p className="mt-5 mb-3 text-body-secondary text-center">&copy; 2024</p>
            </Container>

        </>
    );
};

export default Home;