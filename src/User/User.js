import React from 'react';
import { Route, Switch } from 'react-router-dom/cjs/react-router-dom.min';
import GetUser from './GetUser';
import GetUserDetail from './GetUserDetail';
import UserList from './UserList';
import UpdateUser from './UpdateUser';

const User = () => {

    console.log("User");

    return (
        <Switch>
          <Route path='/User/GetUser'><GetUser/></Route>
          <Route path='/User/GetUserDetail'><GetUserDetail/></Route>
          <Route path='/User/UserList'><UserList/></Route>
          <Route path='/User/UpdateUser'><UpdateUser/></Route>
        </Switch>
    );
};

export default User;