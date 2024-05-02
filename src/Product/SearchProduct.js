import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Container, Form, Row } from 'react-bootstrap';
import $ from 'jquery';
import { useInView } from 'react-intersection-observer';
import { Link } from 'react-router-dom/cjs/react-router-dom';
import '../Home/Home.css';

const SearchProduct = () => {

    console.log("SearchProduct");

    axios.defaults.headers.post['Content-Type'] = 'application/json;charset=EUC-KR';

    const [resultPage, setResultPage] = useState([]);
    const [productList, setProductList] = useState([]);
    const [cateGoryList, setCategoryList] = useState([]);
    const [priceOption, setPriceOption] = useState('');
    const [category, setCategory] = useState('0');
    const [high, setHigh] = useState(false);
    const [low, setLow] = useState(false);
    const [renderCnt, setRenderCnt] = useState(0);
    const search = "search";
    const [currentPage, setCurrentPage] =useState(2);
    const [ref, inView] = useInView();

    const getProductList = async () => {

        console.log("getProductList");

        await axios.post("http://192.168.0.18:8000/react/product/productList", {
            currentPage:1,
            priceOption:priceOption,
            menu:search
        }).then((res) => {

            console.log(res);
            setProductList(res.data.list);
            setResultPage(res.data.resultPage);

        }).catch((err) => {
            console.log(err);
        });

        setCurrentPage(currentPage + 1);

    };

    const getCategoryList = async () => {

        await axios.get("http://192.168.0.18:8000/react/product/getCategoryList")
        .then((res) => {
            console.log(res);
            setCategoryList(res.data);
        }).catch((err) => {
            console.log(err);
        });

    };

    useEffect( () => {

        console.log("rendering");
        getProductList();
        getCategoryList();
        setCurrentPage(2);


    }, [  ]);

    const highHandler = () => {

        setHigh(!high);
        setRenderCnt(renderCnt + 1);
        setLow(false);
        setPriceOption(!high ? 'high' : null);
        console.log("priceOption : "+priceOption);
   };

   const lowHandler = () => {

        setLow(!low);
        setRenderCnt(renderCnt + 1);
        setHigh(false);
        setPriceOption(!low ? 'low' : null);
        console.log("priceOption : "+priceOption);
   };

   useEffect(() => {

        console.log("high, low : "+high+", "+low);
        setCurrentPage(1);
        doSearch();

   }, [high, low, priceOption, category]);

   useEffect(() => {

    if(inView) {
        //setCurrentPage(currentPage + 1);
        appendProductList();
    }

   }, [inView]);

   function isHangulCompleted(input) {
        var pattern = /[\xB0-\xC8][\xA1-\xFE][\xA1-\xFE]/;
        return pattern.test(input);
    }

    const getAutoList = async () => {



    };

   const doSearch = async () => {

        let cateNo = $('.category').val();
        let searchCondition = $('.searchCondition').val();
        let searchKeyword = $('.searchKeyword').val();
        // if(high) {
        //     setPriceOption('high');
        // }else if(low) {
        //     setPriceOption("low");
        // }else if(!high == !low) {
        //     setPriceOption('');
        // }

        await axios.post("http://192.168.0.18:8000/react/product/productList", {
            currentPage:1,
            cateNo:cateNo,
            searchCondition:searchCondition,
            searchKeyword:searchKeyword,
            priceOption:priceOption,
            menu:search
        }).then((res) => {

            console.log(res);
            setProductList(res.data.list);
            setResultPage(res.data.resultPage);

        }).catch((err) => {
            console.log(err);
        });

    };

    const appendProductList = async () => {

        console.log("currentPage : "+currentPage);

        //setCurrentPage(currentPage + 1);

        let cateNo = $('.category').val();
        let searchCondition = $('.searchCondition').val();
        let searchKeyword = $('.searchKeyword').val();

        axios.post("http://192.168.0.18:8000/react/product/productList", {
            currentPage:currentPage,
            cateNo:cateNo,
            searchCondition:searchCondition,
            searchKeyword:searchKeyword,
            priceOption:priceOption,
            menu:search
        })
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

    return (
        <>
        <Container>
            
            <div class="page-header text-info">
                <h3>상품검색</h3>
            </div>

            <br/>

            <Row>
                <p class="text-primary">
                    전체  {resultPage.totalCount } 건수, 현재 {resultPage.currentPage}  페이지
                </p>
            </Row>
            <Row>
                <Col xs={6} md={2}>
                        <Form.Select onChange={() => setCategory($('.category').val())} className='category' aria-label="Default select example" >
                            <option value={0}>카테고리</option>
                            {
                                cateGoryList.map((category, index) => {

                                    //console.log(category);

                                    return (
                                        <option value={category.cateNo}>
                                            {category.cateName}
                                        </option>
                                    )
                                })
                            }
                        </Form.Select>
                </Col>
                <Col xs={6} md={4}>
                    
                </Col>
                <Col>
                    <Form.Check type="switch" checked={high} 
                        onChange={() => highHandler()} label="가격 높은 순"/>
                    <Form.Check type="switch" checked={low} 
                        onChange={() => lowHandler()} label="가격 낮은 순"/>
                </Col>
            </Row>
            <Row className="mb-3 justify-content-end" >

                

                <Col xs={6} md={2} >
                    <Form.Select className='searchCondition' aria-label="Default select example" >
                        <option value="1" >
                            상품명
                        </option>
                    </Form.Select>
                </Col>
                <Col xs={6} md={3} >
                    <Form.Control className='searchKeyword' />
                </Col>
                <Col xs={6} md={1} >
                    <Button onClick={() => {doSearch()}} >검색</Button>
                </Col>
            </Row>

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
                                                    <Button variant="primary"><Link to={{pathname:'/Product/GetProduct', state:{prodNo: product.prodNo, menu:"search"}}} style={{"color":"white"}} >상세정보 보기</Link></Button>
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

export default SearchProduct;