import React, { useState } from 'react';
import AddEditAppointmentComment from './AddEditAppointmentComment';
import PropTypes from 'prop-types';
import debug from 'sabio-debug';
import commentService from '../../../services/commentService';
import toastr from 'toastr';
import 'toastr/build/toastr.css';

const _logger = debug.extend('AppointmentCommentCard');

function AppointmentCommentCard(props) {
    const [cardData, setCardData] = useState({ isReplying: false, isEditing: false });

    const [deleteData] = useState({ isDeleted: 1 });

    const aComment = props.comment;
    const user = props.currentUser;
  
    const createMarkup = (text) => {
        return { __html: text };
    };

    _logger('AppointmentCommentCard', props);

    const mapReplies = (aComment) => (
        <AppointmentCommentCard
            key={aComment.id}
            comment={aComment}
            refresh={getComment}
            editButton={onIsEditing}
            cardData={cardData}
            replyButton={onIsReplying}
            currentUser={props.currentUser}></AppointmentCommentCard>
    );

    const onDelete = (e) => {
        const id = parseInt(e.target.value);
        commentService.updateCommentStatus(id, deleteData).then(onDeleteCommentSuccess).catch(onDeleteCommentError);
    };

    const onDeleteCommentSuccess = (response) => {
        getComment();
        _logger('Delete Comment', response);
    };
    const onDeleteCommentError = (error) => {
        _logger('Delete Comment Error', error);
        toastr.warning('Error deleting comment');
    };

    const onIsReplying = () => {
        setCardData((prevState) => {
            const sp = { ...prevState };
            sp.isReplying = !prevState.isReplying;
            return sp;
        });
    };

    const onIsEditing = () => {
        setCardData((prevState) => {
            const sp = { ...prevState };
            sp.isEditing = !prevState.isEditing;
            if (prevState.isReplying === true) {
                sp.isReplying = !prevState.isReplying;
            }
            return sp;
        }, []);
    };

    const getComment = () => {
        props.refresh();
    };

    const getParsedDate = (strDate) => {
        let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const strSplitDate = String(strDate).split(' ');
        let date = new Date(strSplitDate[0]);
        let dd = date.getDate();
        let mm = date.getMonth();

        const yyyy = date.getFullYear();
        if (dd < 10) {
            dd = '0' + dd;
        }

        date = `${months[mm]} ${dd}, ${yyyy}`;

        return date;
    };

    return (
        <React.Fragment>
            <div className="commentCard-container mb-2">
                <div className="col" style={{ marginLeft: '20%', marginRight: '10%' }}>
                    <div className="col mt-3" style={{ fontSize: 16, color: 'black', fontWeight: 'bolder' }}>
                        <img
                            src={aComment.userProfile.avatarUrl}
                            style={{ borderRadius: '50%' }}
                            width="30"
                            height="30"
                            className="d-inline-block align-top ms-1 me-3 mb-1"
                            alt="avatar"
                        />
                        {`${aComment.userProfile.firstName} ${aComment.userProfile.lastName}`}
                        <small className="text-muted ms-3">{getParsedDate(aComment.dateModified)}</small>
                    </div>
                    {aComment.subject ? (
                        <p
                            className="my-1 mb-3 ms-3"
                            style={{ fontWeight: 'bold' }}
                            dangerouslySetInnerHTML={createMarkup(aComment.subject)}></p>
                    ) : (
                        <p className="d-none"></p>
                    )}
                    <p className=" my-1 mb-3 ms-3" dangerouslySetInnerHTML={createMarkup(aComment.text)}></p>
                    {aComment.id ? (
                        <div className="my-1 mb-3 ms-3">
                            {aComment.parentId === 0 && aComment.createdBy !== user.id ? (
                                <button className=" btn btn-outline-info btn-sm" onClick={onIsReplying}>
                                    <i className="col-1"></i> Reply
                                </button>
                            ) : (
                                <div className="d-none"></div>
                            )}
                            {user.id === aComment.createdBy ? (
                                <button
                                    className="col-2 btn btn-outline-danger btn-sm"
                                    style={{ color: 'red' }}
                                    value={`${aComment.id}`}
                                    onClick={onDelete}>
                                    <i className="col" style={{ color: 'red' }}></i> 
                                    Delete
                                </button>
                            ) : null}
                        </div>
                    ) : null}
                </div>
            </div>
            {cardData.isReplying || cardData.isEditing ? (
                <div className="mx-n2 p-2">
                    {props.currentUser && (
                        <AddEditAppointmentComment
                            refresh={getComment}
                            entityTypeId={props.entityTypeId}
                            entityId={props.entityId}
                            replyButton={onIsReplying}
                            editButton={onIsEditing}
                            cardData={cardData}
                            comment={aComment}></AddEditAppointmentComment>
                    )}
                </div>
            ) : null}
            <div className="comment-reply-container">
                <div className="row">
                    <div className="col" style={{ marginLeft: '10%' }}>
                        {aComment.replies?.map(mapReplies)}
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
}

AppointmentCommentCard.propTypes = {
    currentUser: PropTypes.shape({
        id: PropTypes.number.isRequired,
        roles: PropTypes.arrayOf(PropTypes.string),
        email: PropTypes.string.isRequired,
        isLoggedIn: PropTypes.bool.isRequired,
    }),
    comment: PropTypes.shape({
        id: PropTypes.number.isRequired,
        subject: PropTypes.string,
        text: PropTypes.string.isRequired,
        parentId: PropTypes.number.isRequired,
        createdBy: PropTypes.number.isRequired,
        userProfile: PropTypes.shape({
            firstName: PropTypes.string.isRequired,
            lastName: PropTypes.string.isRequired,
            avatarUrl: PropTypes.string.isRequired,
        }),
        dateCreated: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        dateModified: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        replies: PropTypes.arrayOf(
            PropTypes.shape({
                id: PropTypes.number.isRequired,
                subject: PropTypes.string,
                text: PropTypes.string.isRequired,
                parentId: PropTypes.number.isRequired,
                createdBy: PropTypes.number.isRequired,
                dateCreated: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
                dateModified: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
            })
        ),
    }),
    refresh: PropTypes.func,
    entityTypeId: PropTypes.number,
    entityId: PropTypes.number,
};

export default AppointmentCommentCard;
