import axios from 'axios';
import React from 'react'
import {Container, Navbar, NavDropdown, Nav} from 'react-bootstrap'
import { useCookies } from 'react-cookie';
import { Link, useHistory } from 'react-router-dom/cjs/react-router-dom.min';

const Toolbar = () => {

    console.log("Toolbar");

    const [cookies, setCookie, removeCookie] = useCookies(['userId']);
    const history = useHistory();

    console.log("cookies.userId : "+cookies.userId);

    // 쿠키 변경될 때마다 실행되는 useEffect
    React.useEffect(() => {
        console.log('Cookies updated:', cookies); // 쿠키 변경 사항을 로그에 출력
        // 여기서 다른 쿠키에 대한 처리를 수행할 수 있음
    }, [cookies]);

    const logonMenu = <>
    <NavDropdown title="회원관리" id="collapsible-nav-dropdown" >
    <NavDropdown.Item href="#"><Link to='/User/GetUser' style={{ textDecoration: "none", "color":"white"}} >개인정보관리</Link></NavDropdown.Item>
        { cookies.role === 'admin' ?
            (<NavDropdown.Item href="#"><Link to='/User/UserList' style={{ textDecoration: "none", "color":"white"}} >회원정보관리</Link></NavDropdown.Item>) : ''
        }
    </NavDropdown>
    { cookies.role === 'admin' ?
    (<NavDropdown title="판매상품관리">
    <NavDropdown.Item href="#"><Link to='/Product/AddProduct' style={{ textDecoration: "none", "color":"white"}} >판매상품등록</Link></NavDropdown.Item>
    <NavDropdown.Item href="#"><Link to='/Product/ProductList' style={{ textDecoration: "none", "color":"white"}}  >판매상품관리</Link></NavDropdown.Item>
    </NavDropdown>) : ''
    }
    <NavDropdown title="상품구매">
    <NavDropdown.Item href="#"><Link to='/Product/SearchProduct' style={{ textDecoration: "none", "color":"white"}}  >상품검색</Link></NavDropdown.Item>
    { cookies.role === 'user' ?
    (<><NavDropdown.Item href="#">구매이력조회</NavDropdown.Item>
    <NavDropdown.Divider />
    <NavDropdown.Item href="#">최근본상품</NavDropdown.Item></>) : ''
    }
    </NavDropdown></>;

    const logOut = async () => {

        //console.log("logOut");

        removeCookie('userId', {path: '/'});
        removeCookie('role', {path: '/'});

        await axios.get("http://192.168.0.18:8000/react/user/logout")
            .then((res) => {
                console.log(res);
                history.push('/');
            })
            .catch((err) => {
                console.log(err);
            });

    };

    return (
            <Navbar fixed='top' expand="lg" className='bg-body-tertiary' bg="primary" data-bs-theme="dark" >
                <Container fluid>
                    <Navbar.Brand href='#' >
                        {/* <a href='/' > */}
                        <Link to='/'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="bi bi-house me-2" viewBox="0 0 16 16">
                                <path d="M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.708L2 8.207V13.5A1.5 1.5 0 0 0 3.5 15h9a1.5 1.5 0 0 0 1.5-1.5V8.207l.646.647a.5.5 0 0 0 .708-.708L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293zM13 7.207V13.5a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5V7.207l5-5z" />
                            </svg>
                        </Link>
                        {/* </a> */}
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                    <Navbar.Collapse id="responsive-navbar-nav">
                        <Nav className='me-auto'>
                            { cookies.userId !== undefined ? logonMenu : '' }
                        </Nav>
                        <Nav>
                            {
                                cookies.userId === undefined ? (<><Nav.Link><Link to='/SignUp' style={{ textDecoration: "none"}} >회원가입</Link></Nav.Link><Nav.Link><Link to='/Login' style={{ textDecoration: "none"}} >로그인</Link></Nav.Link></>)
                                    : (<><Nav.Link><Link style={{ textDecoration: "none", "color":"white"}} to='/User/GetUser'>{cookies.userId}님</Link></Nav.Link><Nav.Link onClick={logOut} style={{ textDecoration: "none"}} ><a href='/'>로그아웃</a></Nav.Link></>)
                            }
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
    );
};

export default Toolbar;
