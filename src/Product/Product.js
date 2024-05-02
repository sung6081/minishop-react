import React from 'react';
import { Route, Switch } from 'react-router-dom/cjs/react-router-dom.min';
import GetProduct from './GetProduct';
import ProductList from './ProductList';
import SearchProduct from './SearchProduct';
import UpdateProduct from './UpdateProduct';
import AddProduct from './AddProduct';
import GetAddProduct from './GetAddProduct ';

const Product = () => {

    console.log("Product");

    return (
        <>
            <Switch>
                <Route path='/Product/GetProduct'><GetProduct/></Route>
                <Route path='/Product/ProductList'><ProductList/></Route>
                <Route path='/Product/SearchProduct'><SearchProduct/></Route>
                <Route path='/Product/UpdateProduct'><UpdateProduct/></Route>
                <Route path='/Product/AddProduct'><AddProduct/></Route>
                <Route path='/Product/GetAddProduct'><GetAddProduct/></Route>
            </Switch>
        </>
    );
};

export default Product;