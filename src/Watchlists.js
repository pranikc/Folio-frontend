import { Table, message, Popconfirm } from "antd";
import React from 'react';
import RatingModal from "./RatingModal";
import { Redirect } from "react-router-dom";

class Watchlists extends React.Component {
    columns = [
        {
            title: "Company Name",
            dataIndex: "companyName",
            key: "companyName",
        },
        {
            title: "Board Members",
            dataIndex: "board_members",
            key: "board_members",
        },
        {
            title: "Year",
            dataIndex: "year",
            key: "year",
        },
        {
            title: "Industry",
            dataIndex: "industry",
            key: "industry",
        },
        {
            title: "My Rating",
            key: "action",
            render: (_text, record) => (
                <RatingModal id={record.id} userId={this.props.userId} showRating={true}/>
            ),
        },
        {
            title: "My Comment",
            key: "action",
            render: (_text, record) => (
                <RatingModal id={record.id} userId={this.props.userId} showRating={false}/>
            ),
        },
        {
            title: "",
            key: "action",
            render: (_text, record) => (
                <Popconfirm title="Are you sure to delete this from watchlist?" onConfirm={() => this.deleteWatchlist(record.id)} okText="Yes" cancelText="No">
                    <a href="#" type="danger">
                        Delete{" "}
                    </a>
                </Popconfirm>
            ),
        },
    ];

    state = {
        watchlists: [],
        my_watchlist: [],
        watchlist_id: null,
        redirect: false
    }

    componentDidMount() {
        this.loadWatchlists();
    }

    loadWatchlists = () => {
        const url = "http://127.0.0.1:5000/watchlists";
        fetch(url)
            .then(r => r.json())
            .then((data) => {
                data.forEach((watchlist) => {
                    const newElement = {
                        key: watchlist.id,
                        id: watchlist.id,
                        company_id: watchlist.company_id,
                        user_id: watchlist.user_id,
                    }

                    this.setState((prevState) => ({
                        watchlists: [...prevState.watchlists, newElement]
                    }));
                });

                this.getMyCompanies();
            });
    };

    getMyWatchlist = (userId) => {
        return this.state.watchlists.filter(function (el) {
            return el.user_id == userId;
        });
    }

    getMyCompanies = () => {
        let companyIds = []
        this.getMyWatchlist(this.props.userId).forEach((obj) => { // login user == 71
            companyIds.push(obj.company_id);
        });

        const url = "http://127.0.0.1:5000/companies";
        fetch(url)
            .then(r => r.json())
            .then((data) => {
                data.forEach((company) => {
                    if (companyIds.includes(company.id)) {
                        const newElement = {
                            key: company.id,
                            id: company.id,
                            companyName: company.name,
                            board_members: company.board_members,
                            year: company.year,
                            industry: company.industry,
                        }

                        this.setState((prevState) => ({
                            my_watchlist: [...prevState.my_watchlist, newElement]
                        }));
                    }
                })
            })
    };

    reloadWatchlists = () => {
        this.setState({ watchlists: [], my_watchlist: [] });
        this.loadWatchlists();
    }

    deleteWatchlist = (id) => {
        let watchlistIds = []
        console.log(id)
        this.getMyWatchlist(this.props.userId).forEach((obj) => { // login user == 71
            if (obj.company_id == id) {
                watchlistIds.push(obj.id);
            }
        });
        console.log(this.getMyWatchlist(this.props.userId))

        const url = `http://127.0.0.1:5000/watchlists/${watchlistIds[0]}`;

        fetch(url, {
            method: "delete",
        })

        this.reloadWatchlists();
        this.setState({ redirect: true });
    };

    render() {
        if (this.state.redirect) {
            this.setState({redirect: false});
            return <Redirect to="/companies"/>
        }
        return (
            <Table className="table-striped_rows" dataSource={this.state.my_watchlist} columns={this.columns} pagination={{pagSize: 5}} />
        )
    }
}

export default Watchlists;