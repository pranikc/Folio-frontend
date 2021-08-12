import React from 'react';
import { Modal } from 'react-responsive-modal';
import 'react-responsive-modal/styles.css';

class RatingModal extends React.Component {
    state = {
        openModal: false,
        rating: 0,
        comment: "",
        rec_id: null,
    }

    componentDidMount() {
        this.getRatingForSingleWatchlist();
    }

    onClickButton = e => {
        this.getRatingForSingleWatchlist();

        e.preventDefault();
        this.setState({
            openModal: true
        });
    }

    onCloseModal = () => {
        this.setState({
            openModal: false
        })
    }

    currentCompanyId = 0;
    currentUserId = 0;
    getRatingForSingleWatchlist = () => {
        const url = `http://127.0.0.1:5000/watchlists`
        fetch(url)
            .then(r => r.json())
            .then((data) => {
                data.forEach((watchlist) => { // only latest rating
                   if (watchlist.company_id == this.props.id && watchlist.user_id == this.props.userId) {
                       this.currentCompanyId = this.props.id;
                       this.currentUserId = this.props.userId;
                       this.getRatingForCompany(this.props.id, this.props.userId);
                   }
                });
            })
    }

    getRatingForCompany = (company_id, user_id) => {
        const url = "http://127.0.0.1:5000/recommendations";
        fetch(url)
            .then(r => r.json())
            .then((data) => {
                data.forEach((rec) => {
                    if (rec.user_id == user_id && rec.company_id == company_id) {
                        this.setState({
                            rating: rec.rating,
                            comment: rec.comment,
                            rec_id: rec.id,
                        });
                    }
                })
            })
    }

    editRating = (e) => {
        const data = {
            id: this.state.rec_id,
            comment: this.state.comment,
            rating: this.state.rating,
            user_id: this.currentUserId,
            company_id: this.currentCompanyId
        }

        e.preventDefault();

        const url = `http://127.0.0.1:5000/recommendations/${this.state.rec_id}`;
        fetch(url, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        })
    }

    render() {
        if (this.props.showRating == true) {
            return (
                <div>
                    <p onClick={this.onClickButton}>{this.state.rating}</p>
                    <Modal open={this.state.openModal} onClose={this.onCloseModal}>
                        <h1>Edit Rating</h1>
                        <form onSubmit={this.editRating}>
                            <input name="rating" type="text" onChange={e => this.setState({rating: e.target.value})}/>
                            <input type="submit" name="Update Rating"/>
                        </form>
                    </Modal>
                </div>
            );
        } else {
            return (
                <div>
                    <p onClick={this.onClickButton}>{this.state.comment}</p>
                    <Modal open={this.state.openModal} onClose={this.onCloseModal}>
                        <h1>Edit Comment</h1>
                        <form onSubmit={this.editRating}>
                            <input name="comment" type="text" onChange={e => this.setState({comment: e.target.value})} />
                            <input type="submit" name="Update Comment"/>
                        </form>
                    </Modal>
                </div>
            )
        }
    }
}

export default RatingModal;