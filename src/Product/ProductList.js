import { width } from '@fortawesome/free-solid-svg-icons/fa0';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Button, Col, Container, Form, OverlayTrigger, Pagination, Popover, Row, Table } from 'react-bootstrap';
import { CheckLg } from 'react-bootstrap-icons';
import { Link } from 'react-router-dom/cjs/react-router-dom';
import $ from 'jquery';

const ProductList = () => {

    console.log("ProductList");

    axios.defaults.headers.post['Content-Type'] = 'application/json;charset=EUC-KR';

    const [popover, setPopover] =useState(<Popover id="popover-basic">
    <Popover.Header as="h3"></Popover.Header>
        <Popover.Body>
            상품명 : <br/>
            상세설명 : <br/>
            제조일자 : <br/>
            가격 : <br/>
            판매상태:
        </Popover.Body>
    </Popover>);

    const [resultPage, setResultPage] = useState([]);
    const [productList, setProductList] = useState([]);
    const [cateGoryList, setCategoryList] = useState([]);
    const [priceOption, setPriceOption] = useState('');
    const [category, setCategory] = useState('0');
    const [high, setHigh] = useState(false);
    const [low, setLow] = useState(false);
    const [renderCnt, setRenderCnt] = useState(0);

    const getProductList = async () => {

        await axios.post("http://192.168.0.18:8000/react/product/productList", {
            currentPage:1,
            priceOption:priceOption
        }).then((res) => {

            console.log(res);
            setProductList(res.data.list);
            setResultPage(res.data.resultPage);

        }).catch((err) => {
            console.log(err);
        });

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
        $('img').css({ width: '100px', height: '50px' });

    }, [ ]);

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
        doSearch();

   }, [high, low, priceOption, category]);

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
            priceOption:priceOption
        }).then((res) => {

            console.log(res);
            setProductList(res.data.list);
            setResultPage(res.data.resultPage);

        }).catch((err) => {
            console.log(err);
        });

    };

    const movePage = async (page) => {

        let cateNo = $('.category').val();
        let searchCondition = $('.searchCondition').val();
        let searchKeyword = $('.searchKeyword').val();

        await axios.post("http://192.168.0.18:8000/react/product/productList", {
            currentPage:page,
            cateNo:cateNo,
            searchCondition:searchCondition,
            searchKeyword:searchKeyword,
            priceOption:priceOption
        }).then((res) => {

            console.log(res);
            setProductList(res.data.list);
            setResultPage(res.data.resultPage);

        }).catch((err) => {
            console.log(err);
        });

    };

    const popoverShow = async (prodNo) => {

        try {
            const res = await axios.get("http://192.168.0.18:8000/react/product/getProduct/" + prodNo);
            console.log(res);
            const product = res.data; // 받아온 데이터를 userData에 저장
            setPopover(
                <Popover id="popover-basic">
                    <Popover.Header as="h3">{product.prodName}</Popover.Header>
                    <Popover.Body>
                    상세설명 : {product.prodDetail}<br/>
                    제조일자 : {product.manuDate}<br/>
                    가격 : {product.price}<br/>
                    등록일자 : {product.regDate}<br/>
                    판매상태 : {product.proTranCode}
                    </Popover.Body>
                </Popover>
            );
        } catch (err) {
            console.log(err);
        }

    };

    return (
        <Container>
            
            <div class="page-header text-info">
                <h3>판매상품관리</h3>
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
                <Col xs={6} md={2}>
                    <Button variant="success" >추가</Button>
                    &nbsp;
                    <Button variant="danger" >삭제</Button>
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
                        <option value="0" >
                            상품번호
                        </option>
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

            <Table borderless >
                    <thead>
                        <tr>
                            <th>No</th>
                            <th>상품명</th>
                            <th>상품이미지</th>
                            <th>가격</th>
                            <th>제조일자</th>
                            <th>간략한 정보</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            productList.map((product, index) => {
                                return (
                                    <>
                                        <tr>
                                            <td>{index+1}</td>
                                            <td className='userId' ><Link to={{pathname:'/Product/GetProduct', state:{prodNo: product.prodNo, menu:"manage"}}} >{product.prodName}</Link></td>
                                            <td><img src={"http://192.168.0.18:8000/images/uploadFiles/" + product.files[0].fileName } style={{ width: '100px', height: '50px' }} /></td>
                                            <td>{product.price}</td>
                                            <td>{product.manuDate}</td>
                                            <td align='left'>
                                                <OverlayTrigger trigger="click" placement="right" rootClose onToggle={() => {popoverShow(product.prodNo)}} overlay={(popover)}>
                                                    <CheckLg style={{ color: 'blue' }} />
                                                </OverlayTrigger>
                                            </td>
                                        </tr>
                                    </>
                                )
                            })
                        }
                    </tbody>
                </Table>

                <br/>

                <Pagination className="justify-content-center" >
                    <Pagination.First onClick={ () => movePage(1)} />
                    <Pagination.Prev disabled={resultPage.beginUnitPage == 1} onClick={ () => movePage(resultPage.beginUnitPage - 1)} />
                    {Array.from({ length: resultPage.endUnitPage - resultPage.beginUnitPage + 1 }).map((_, index) => (
                        <Pagination.Item className={ resultPage.beginUnitPage + index == resultPage.currentPage ? 'active' : '' } onClick={ () => movePage(resultPage.beginUnitPage + index)} >
                            {resultPage.beginUnitPage + index}
                        </Pagination.Item>
                    ))}
                    <Pagination.Next disabled={resultPage.endUnitPage == resultPage.maxPage} onClick={ () => movePage(resultPage.endUnitPage + 1)} />
                    <Pagination.Last onClick={ () => movePage(resultPage.maxPage)} />
                </Pagination>

        </Container>
    );
};

export default ProductList;