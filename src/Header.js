import React from "react";
import { Layout, Menu } from "antd";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";
import Companies from "./Companies";
import Watchlists from "./Watchlists";
import CreateCompanyModal from "./CreateCompanyModal";

const { Header } = Layout;

export default () => (
    <Router>
        <Header>
            <div className="logo" />
            <Menu theme="dark" mode="horizontal" defaultSelectedKeys={["1"]}>
                <Menu.Item key="1"><Link to="/companies">Companies</Link></Menu.Item>
                <Menu.Item key="2"><Link to="/watchlists">My Watchlist</Link></Menu.Item>
                <Menu.Item key="3"><CreateCompanyModal /></Menu.Item>
            </Menu>
        </Header>

        <Switch>
            <Route path="/companies">
                <Companies userId={11} />
            </Route>
            <Route path="/watchlists">
                <Watchlists userId={11}/>
            </Route>
        </Switch>
    </Router>
);