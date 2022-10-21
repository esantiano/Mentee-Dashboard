import React, { useState } from 'react';
import AppointmentCommentCard from './AppointmentCommentCard';
import AddEditAppointmentComment from './AddEditAppointmentComment';
import debug from 'sabio-debug';
import PropTypes from 'prop-types';
import commentService from '../../../services/commentService';
import Pagination from 'rc-pagination';
import 'rc-pagination/assets/index.css';
import locale from 'rc-pagination/lib/locale/en_US';
import toastr from 'toastr';
import 'toastr/build/toastr.css';

const _logger = debug.extend('AppointmentComments');

function AppointmentComments(props) {
    const [entityData, setEntityData] = useState({
        isToggled: false,
        isReplying: false,
        entityTypeId: 5,
        entityId: props.appointmentId,
    });

    const [commentData, setCommentData] = useState({
        arrayOfComments: [],
        commentComponents: [],
        numberOfPages: 0,
        totalPages: 1,
    });

    const [pages] = useState({ pageIndex: 0 });
    const [pageSize] = useState(4);

    const getComments = () => {
        commentService
            .getComments(entityData.entityTypeId, entityData.entityId, pages.pageIndex, pageSize)
            .then(onGetSuccess)
            .catch(onGetError);
    };

    _logger('AppointmentComments props', props);

    const onChange = (e) => {
        _logger('onChange', { syntheticEvent: e });

        commentService
            .getComments(entityData.entityTypeId, entityData.entityId, e - 1, pageSize)
            .then(onGetSuccess)
            .catch(onGetError);
    };

    const onGetSuccess = (response) => {
        _logger('Get Success response', response);
        let commentArray = response.item.pagedItems;
        setCommentData((prevState) => {
            const cd = { ...prevState };
            cd.totalPages = response.item.totalCount;
            cd.arrayOfComments = commentArray;
            cd.commentComponents = commentArray.map(mapComment);
            return cd;
        });
    };

    const onGetError = (error) => {
        _logger('GetCreatedBy Error', error);
        toastr.warning('Error retrieving comments.');
    };

    const mapComment = (aComment) => {
        _logger('commentMap', aComment);
        if(aComment.isDeleted !== 2)
        {return (
            <AppointmentCommentCard
                key={aComment.id}
                comment={aComment}
                refresh={getComments}
                entityTypeId={entityData.entityTypeId}
                entityId={entityData.entityId}
                currentUser={props.currentUser}></AppointmentCommentCard>
        )};
    };

    const onIsToggled = () => {
        setEntityData((prevState) => {
            const sp = { ...prevState };
            sp.isToggled = !prevState.isToggled;
            return sp;
        });
        if (entityData.isToggled !== true) {
            getComments();
        }
    };

    const onIsReplying = () => {
        setEntityData((prevState) => {
            const sp = { ...prevState };
            sp.isReplying = !prevState.isReplying;
            return sp;
        });
    };

    return (
        <React.Fragment>
            <div
                className="body-container mx-auto mb-5"
                style={{ width: 800, borderWidth: 0.25 }}>
                <h3 className="text-center mb-3 mt-3" style={{ color: 'Grey' }}>
                    Comments
                </h3>
                {
                    <div className="mx-n2 p-2">
                        {
                            <AddEditAppointmentComment
                                refresh={getComments}
                                entityTypeId={entityData.entityTypeId}
                                entityId={entityData.entityId}
                                replyButton={onIsReplying}
                                currentUser={props.currentUser}
                                parentId={0}></AddEditAppointmentComment>
                        }
                    </div>
                }

                <div className="row">
                    <div className="text-center mt-2 mb-2">
                        {!entityData.isToggled ? (
                            <button
                                className="btn btn-outline-secondary"
                                style={{ color: 'grey' }}
                                onClick={onIsToggled}>
                                View Comments
                            </button>
                        ) : (
                            <button
                                className="btn btn-outline-secondary"
                                onClick={onIsToggled}
                                style={{ color: 'grey' }}>
                                Hide Comments
                            </button>
                        )}
                    </div>
                    <div className="text-center mt-2 mb-2">
                        {
                            <Pagination
                                current={pages.pageIndex}
                                total={commentData.totalPages}
                                pageSize={pageSize}
                                onChange={onChange}
                                locale={locale}></Pagination>
                        }
                    </div>
                </div>

                {entityData.isToggled ? (
                    <div className="comment-container">
                        <div className="mx-n2 me-2 p-2 mt-3">{commentData.commentComponents}</div>
                    </div>
                ) : null}
            </div>
        </React.Fragment>
    );
}

AppointmentComments.propTypes = {
    currentUser: PropTypes.shape({
        id: PropTypes.number,
        roles: PropTypes.arrayOf(PropTypes.string),
        email: PropTypes.string,
        isLoggedIn: PropTypes.bool,
    }),
    appointmentId: PropTypes.number,
    entityTypeId: PropTypes.number,
    entityId: PropTypes.number,
};

export default AppointmentComments;
