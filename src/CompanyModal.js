import React from 'react';
import { Modal } from 'react-responsive-modal';
import 'react-responsive-modal/styles.css';
import { Markup } from 'interweave'

class CompanyModal extends React.Component {
    state = {
        openModal: false,
        modalOutput: "None",
        rating: 0,
        comment: ""
    }

    componentDidMount() {
        this.recommendationRatings()
    }

    onClickButton = e => {
        this.recommendationRatings(this.props.id);

        e.preventDefault();
        this.setState({
            openModal: true
        });
    }

    onCloseModal = () => {
        this.setState({
            modalOutput: ""
        })

        this.setState({
            openModal: false
        })
    }

    recommendationRatings = async (id) => {
        const res = await fetch(`http://127.0.0.1:5000/recommendations`);
        const data = await res.json();

        let recRatingsInnerList = "";

        data.forEach((rec) => {
            if (rec.company_id == id) {
                recRatingsInnerList += rec.rating.toString()+", ";
            }
        })

        this.setState({
            modalOutput: recRatingsInnerList
        })
    }

    addRating = (e) => {
        const data = {
            user_id: this.props.userId,
            company_id: this.props.id,
            rating: this.state.rating,
            comment: this.state.comment,
        }
        console.log(data)
        e.preventDefault();

        const url = "http://127.0.0.1:5000/recommendations";
        fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        })

        // add to watchlist if rec is made
        const watchListData = {
            company_id: this.props.id,
            user_id: this.props.userId,
        }
        console.log(watchListData)
        const urlWatchlist = "http://127.0.0.1:5000/watchlists";
        fetch(urlWatchlist, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(watchListData),
        })

        this.setState({
            openModal: false
        })
    }

    render() {
        return (
            <div>
                <button onClick={this.onClickButton}>View Details</button>
                <Modal open={this.state.openModal} onClose={this.onCloseModal}>
                    <h1>Ratings: </h1>
                    <li>
                        <Markup content={this.state.modalOutput} />
                    </li>
                    <br />
                    <br />
                    <h3>Add Custom Recommendation</h3>
                    <form onSubmit={this.addRating}>
                        Rating (#): <input name="rating" type="text" onChange={e => this.setState({rating: e.target.value})} /> <br /><br/>
                        Comment: <input name="comment" type="text" onChange={e => this.setState({comment: e.target.value})} /> <br />
                        <input type="submit" name="Create" />
                    </form>
                </Modal>
            </div>
        );
    }
}

export default CompanyModal;