import React from 'react';
import { Modal } from 'react-responsive-modal';
import 'react-responsive-modal/styles.css';

class CreateCompanyModal extends React.Component {
    state = {
        openModal: false,
        name: "",
        board_members: "",
        year: 0,
        industry: ""
    }

    onClickButton = e => {
        e.preventDefault();
        this.setState({
            openModal: true
        })
    }

    onCloseModal = () => {
        this.setState({
            openModal: false
        })
    }

    createCompany = (e) => {
        const data = {
            name: this.state.name,
            board_members: this.state.board_members,
            year: this.state.year,
            industry: this.state.industry
        }
        console.log(data)
        e.preventDefault();

        const url = "http://127.0.0.1:5000/companies";
        fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data),
        })
    }

    render() {
        return (
            <div>
                <p onClick={this.onClickButton}>Upload Company</p>
                <Modal open={this.state.openModal} onClose={this.onCloseModal}>
                    <h1>Create a new Company</h1>
                    <form onSubmit={this.createCompany}>
                        Name: <input name="name" type="text" onChange={e => this.setState({name: e.target.value})} /><br/><br/>
                        Board Members: <input name="board_members" type="text" onChange={e => this.setState({board_members: e.target.value})} /><br/><br/>
                        Year Founded: <input name="year" type="text" onChange={e => this.setState({year: e.target.value})} /><br/><br/>
                        Industry: <input name="industry" type="text" onChange={e => this.setState({industry: e.target.value})} /><br/><br/>
                        <input type="submit" name="Create Company" />
                    </form>
                </Modal>
            </div>
        )
    }
}

export default CreateCompanyModal;