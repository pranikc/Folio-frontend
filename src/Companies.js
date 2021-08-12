import { Table, message, Popconfirm } from "antd";
import React from "react";
import CompanyModal from "./CompanyModal";
import { Redirect } from "react-router-dom";

class Companies extends React.Component {
    columns = [
        {
            title: "Name",
            dataIndex: "name",
            key: "name",
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
            title: "",
            key: "action",
            render: (_text, record) => (
                <CompanyModal id={record.id} userId={this.props.userId} />
            ),
        },
        {
            title: "",
            key: "action",
            render: (_text, record) => (
                <Popconfirm title="Are you sure to delete this from companies?" onConfirm={() => this.deleteCompany(record.id)} okText="Yes" cancelText="No">
                    <a href="#" type="danger">
                        Delete{" "}
                    </a>
                </Popconfirm>
            ),
        },
    ];

    state = {
        companies: [],
        redirect: false,
    }

    componentDidMount() {
        this.loadCompanies();
    }

    loadCompanies = () => {
        const url = "http://127.0.0.1:5000/companies";
        fetch(url)
            .then(r => r.json())
            .then((data) => {
                data.forEach((company) => {
                    const newElement = {
                        key: company.id,
                        id: company.id,
                        name: company.name,
                        board_members: company.board_members,
                        year: company.year,
                        industry: company.industry,
                    }

                    this.setState((prevState) => ({
                        companies: [...prevState.companies, newElement]
                    }));
                })
            })
    };

    reloadCompanies = () => {
        this.setState({ companies: []});
        this.loadCompanies();
    }

    deleteCompany = (companyId) => {
        let companyIds = [];

        this.state.companies.forEach((company) => {
            if (company.id == companyId) {
                companyIds.push(company.id);
            }

            const url = `http://127.0.0.1:5000/companies/${companyIds[0]}`;
            fetch(url, {
                method: "delete",
            })
        })

        this.reloadCompanies();
        this.setState({redirect: true });
    }

    render() {
        if (this.state.redirect) {
            this.setState({redirect: false});
            return <Redirect to="/watchlists" />
        }
        return (
            <Table className="table-striped_rows" dataSource={this.state.companies} columns={this.columns} pagination={{pageSize: 7}} />
        )
    }
}

export default Companies;