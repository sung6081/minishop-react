import React, { useEffect, useState } from 'react';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import ReactDatePicker from 'react-datepicker';
import axios from 'axios';
import $, { event } from 'jquery';
import { useHistory } from 'react-router-dom/cjs/react-router-dom';
import 'react-datepicker/dist/react-datepicker.css';

const AddProduct = () => {

    console.log("AddProduct");

    const [startDate, setStartDate] = useState(new Date());
    const [category, setCategory] = useState('0');
    const [cateList, setCateList] = useState([]);
    const [files, setFiles] = useState([]);
    const history = useHistory();

    //axios.defaults.headers.post['Content-Type'] = 'multipart/form-data; charset=EUC-KR';

    const getCateList = async () => {

        await axios.get("http://192.168.0.18:8000/react/product/getCategoryList")
        .then((res) => {
            console.log(res);
            setCateList(res.data);
        }).catch((err) => {
            console.log(err);
        });

    };

    useEffect(() => {
        // 컴포넌트가 마운트될 때 react-datepicker의 스타일 파일을 추가
        // const link = document.createElement('link');
        // link.rel = 'stylesheet';
        // link.type = 'text/css';
        // link.href = 'https://cdn.jsdelivr.net/npm/react-datepicker/dist/react-datepicker.css';
        // document.head.appendChild(link);
        getCateList();
    }, []);

    function euckrEncode(str) {
        return unescape(encodeURIComponent(str));
    }

    const addProduct = async () => {

        let prodName = $('.prodName').val();
        let prodDetail = $('.prodDetail').val();
        let manuDate = $('.manuDate').val();
        let price = $('.price').val();
        let fd = new FormData();

        Object.values(files).forEach((file) => {fd.append("file", file)});

        fd.append("prodName", encodeURI(prodName));
        fd.append("prodDetail", encodeURI(prodDetail));
        fd.append("manuDate", manuDate);
        fd.append("price", price);
        fd.append("cateNo", category);

        console.log("fd : "+fd.files);

        if(prodName == '') {
            alert('상품명을 입력해주세요');
            $('.prodName').focus();
            return;
        }

        if(prodDetail == '') {
            alert('상세정보를 적어주세요');
            $('.prodDetail').focus();
            return;
        }

        if(manuDate == '') {
            alert('제조일자를 입력해주세요');
            return;
        }

        await axios.post("http://192.168.0.18:8000/react/product/addProduct", 
            fd).then((res) => {
            console.log(res);
            history.push('/Product/GetAddProduct', {prodNo:res.data.prodNo});
        }).catch((err) => {
            console.log(err);
        });

    };

    const fileChangeHandler = (event) => {

        setFiles(event.target.files);
        console.log(event.target.files);
        //console.log(files);

    };

    return (
        <>
            <Container>
                <h3 class=" text-info">상품등록</h3>
            
                <br/><br/>

                <Form.Group as={Row} >
                        <Form.Label column sm={3} className="col-sm-offset-1 control-label">상품명</Form.Label>
                        <Col sm={4}>
                            <Form.Control className='prodName'defaultValue='' type="text" placeholder='상품명' />
                        </Col>
                </Form.Group>

                <br/>

                <Form.Group as={Row} controlId="password">
                    <Form.Label column sm={3} className="col-sm-offset-1 control-label">상품상세정보</Form.Label>
                    <Col sm={4}>
                        <Form.Control className='prodDetail' defaultValue='' type="text" placeholder="상품상세정보" />
                    </Col>
                </Form.Group>

                <br/>


                <Form.Group as={Row} controlId="userName">
                    <Form.Label column sm={3} className="col-sm-offset-1 control-label">제조일자</Form.Label>
                    <Col sm={2}>
                        {/* <Form.Control className='manuDate' defaultValue='' type="text" placeholder="제조일자" /> */}
                        <ReactDatePicker
                            className='manuDate'
                             selected={startDate}
                             onChange={(date) => setStartDate(date)}
                             dateFormat="yyyy-MM-dd"
                        />
                    </Col>
                </Form.Group>

                <br/>

                <Form.Group as={Row} controlId="ssd">
                    <Form.Label column sm={3} className="col-sm-offset-1 control-label">가격</Form.Label>
                    <Col sm={4}>
                        <Form.Control className='price' defaultValue='' type="text" placeholder="가격" />
                    </Col>
                </Form.Group>

                <br/>

                <Form.Group as={Row} controlId="addr">
                    <Form.Label column sm={3} className="col-sm-offset-1 control-label">카테고리</Form.Label>
                    <Col sm={2}>
                        <Form.Select onChange={() => setCategory($('.category').val())} className='category' aria-label="Default select example" >
                            <option value={0}>카테고리</option>
                            {
                                cateList.map((category, index) => {

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
                </Form.Group>

                <br/>

                <Form.Group as={Row} controlId="email">
                    <Form.Label column sm={3} className="col-sm-offset-1 control-label">이미지</Form.Label>
                    <Col xs={4}>
                        <Form.Control onChange={fileChangeHandler} type="file" multiple />
                    </Col>
                </Form.Group>

                <br/>

                <Form.Group as={Row}>
                    <Col sm={{ span: 6, offset: 2 }} className="text-center">
                        <Button variant="primary" onClick={() => addProduct()} >등록</Button>
                        &nbsp;
                        <Button variant="primary" >취소</Button>
                    </Col>
                </Form.Group>

            </Container>
        </>
    );
};

export default AddProduct;