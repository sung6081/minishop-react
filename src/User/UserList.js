import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Button, Col, Container, Form, OverlayTrigger, Pagination, Popover, Row, Table } from 'react-bootstrap';
import $ from 'jquery';
import { CheckLg } from 'react-bootstrap-icons'
import { Link } from 'react-router-dom/cjs/react-router-dom.min';

const UserList = () => {

    console.log("UserList");

    axios.defaults.headers.post['Content-Type'] = 'application/json;charset=EUC-KR';

    const [userList, setUserList] = useState([]);
    const [resultPage, setResultPage] = useState([]);

    const condition = $('.searchCondition').val();
    const keyword = $('.searchKeyword').val();

    var page = 1;

    const getUserList = async () => {

        await axios.post("http://192.168.0.18:8000/react/user/getUserList", {
            currentPage:page
        }).then((res) => {
            console.log(res);
            setUserList(res.data.list);
            setResultPage(res.data.resultPage);
        })
        .catch((err) => {
            console.log(err);
        });

    }

    const doSearch = async () => {
        
        await axios.post("http://192.168.0.18:8000/react/user/getUserList", {
            currentPage:page,
            searchCondition:$('.searchCondition').val(),
            searchKeyword:$('.searchKeyword').val()
        })
        .then((res) => {
            console.log(res);
            setUserList(res.data.list);
            setResultPage(res.data.resultPage);
        })
        .catch((err) => {
            console.log(err);
        });

    };

    const movePage = async (currentPage) => {

        await axios.post("http://192.168.0.18:8000/react/user/getUserList", {
            currentPage:currentPage,
            searchCondition:condition,
            searchKeyword:keyword
        })
        .then((res) => {
            console.log(res);
            setUserList(res.data.list);
            setResultPage(res.data.resultPage);
        })
        .catch((err) => {
            console.log(err);
        });

    };

    const [popover, setPopover] =useState(<Popover id="popover-basic">
    <Popover.Header as="h3"></Popover.Header>
        <Popover.Body>
            이름 : <br />
            주소 : <br />
            휴대전화번호 : <br />
            이메일 : 
        </Popover.Body>
    </Popover>);

    const popoverShow = async (userId) => {

        try {
            const res = await axios.get("http://192.168.0.18:8000/react/user/getUser/" + userId);
            console.log(res);
            const userData = res.data; // 받아온 데이터를 userData에 저장
            setPopover(
                <Popover id="popover-basic">
                    <Popover.Header as="h3">{userId}</Popover.Header>
                    <Popover.Body>
                        이름 : {userData.userName}<br />
                        주소 : {userData.addr}<br />
                        휴대전화번호 : {userData.phone}<br />
                        이메일 : {userData.email}
                    </Popover.Body>
                </Popover>
            );
        } catch (err) {
            console.log(err);
        }

    };

    useEffect(() => {

        getUserList();

    }, []);

    $('.userId').css('color', 'blue');

    return (
        <>

            <Container>

                <div class="page-header text-info">
                    <h3>회원목록조회</h3>
                </div>

                <br/>

                <Row>
                    <p class="text-primary">
                        전체  {resultPage.totalCount } 건수, 현재 {resultPage.currentPage}  페이지
                    </p>
                </Row>
                <Row className="mb-3 justify-content-end" >
                    <Col xs={6} md={2} >
                        <Form.Select className='searchCondition' aria-label="Default select example" >
                            <option value="0" >
                                아이디
                            </option>
                            <option value="1" >
                                이름
                            </option>
                        </Form.Select>
                    </Col>
                    <Col xs={6} md={3} >
                        <Form.Control className='searchKeyword' />
                    </Col>
                    <Col xs={6} md={1} >
                        <Button onClick={doSearch} >검색</Button>
                    </Col>
                </Row>

                <Table borderless >
                    <thead>
                        <tr>
                            <th>No</th>
                            <th>회원 ID</th>
                            <th>회원명</th>
                            <th>이메일</th>
                            <th>간략한 정보</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            userList.map((user, index) => {
                                return (
                                    <>
                                        <tr>
                                            <td>{index+1}</td>
                                            <td className='userId' ><Link to={{pathname:'/User/GetUserDetail', state:{userId: user.userId}}} >{user.userId}</Link></td>
                                            <td>{user.userName}</td>
                                            <td>{user.email}</td>
                                            <td align='left'>
                                                <OverlayTrigger trigger="click" placement="right" rootClose onToggle={() => {popoverShow(user.userId)}} overlay={(popover)}>
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

        </>
    );
};

export default UserList;