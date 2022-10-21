import React, { useEffect, useState } from 'react';
import commentService from '../../../services/commentService';
import PropTypes from 'prop-types';
import debug from 'sabio-debug';
import { Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import toastr from 'toastr';
import 'toastr/build/toastr.css';

const _logger = debug.extend('AddEditAppointmentComment');
const basicSchema = Yup.object().shape({
    subject: Yup.string().max(25),
    text: Yup.string().max(1500).required('Is Required'),
});

function AddEditAppointmentComment(props) {
    const [commentFormData, setCommentFormData] = useState({
        id: 0,
        subject: '',
        text: '',
        parentId: 0,
        isDeleted: 1,
        entityTypeId: props.entityTypeId,
        entityId: props.entityId,
        createdBy: props.currentUser.id,
    });

    _logger('Add/Edit Comment Props', { props });

    const commentData = props.comment;
    const replying = props.cardData;

    useEffect(() => {
        if (commentData) {
            setCommentFormData((prevState) => {
                let cd = { ...prevState };
                if (replying.isEditing) {
                    cd = { ...commentData };
                } else {
                    cd.parentId = commentData.id;
                }
                _logger('CommentFormData after useEffect', commentFormData);
                return cd;
            });
        }
    }, []);

    const refreshComments = () => {
        props.refresh();
    };

    _logger('CommentFormData', { commentFormData });

    const onSubmitComment = (values, actions) => {
        if (values.id > 0) {
            values.parentId = values.id;
        }

        _logger('Formik values', values);

        values.entityTypeId = props.entityTypeId;
        values.entityId = props.entityId;

        _logger('Formik Values', values);
        actions.resetForm();
        if (values.id === 0) {
            commentService.addComment(values).then(onAddCommentSuccess).catch(onAddCommentError);
        } else {
            commentService.editComment(values.id, values).then(onEditCommentSuccess).catch(onEditCommentError);
        }
    };

    const onAddCommentSuccess = (response) => {
        props.replyButton();
        refreshComments();
        _logger('onAddCommentSuccess', { response });
        toastr.success('Comment added successfully');
    };

    const onAddCommentError = (error) => {
        _logger('onAddCommentError', { error });
        toastr.warning('Error posting comment');
        setCommentFormData((prevState) => {
            const cd = { ...prevState };
            cd.id = 0;
            return cd;
        });
    };

    const onEditCommentSuccess = (response) => {
        props.editButton();
        refreshComments();
        _logger('onUpdateCommentSuccess', { response });
        toastr.success('Successfully edited comment');
    };

    const onEditCommentError = (error) => {
        _logger('onUpdateCommentError', { error });
        toastr.warning('Error editing comment');
    };

    const onClose = () => {
        if (commentFormData.id !== 0) {
            props.editButton();
        } else if (commentFormData.parentId > 0) {
            props.replyButton();
        }
    };

    return (
        <React.Fragment>
            <div
                className="form-container"
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '20vh',
                }}>
                <Formik
                    enableReinitialize={true}
                    initialValues={commentFormData}
                    onSubmit={onSubmitComment}
                    validationSchema={basicSchema}>
                    <Form>
                        <div className="row">
                            <div className="col" style={{ justifyContent: 'center' }}>
                                {commentFormData?.parentId === 0 ? (
                                    <div className="form-group">
                                        <Field
                                            type="text"
                                            className="form-control"
                                            name="subject"
                                            placeholder="Subject"
                                        />
                                    </div>
                                ) : null}

                                <div className="row mt-1">
                                    <div className="col">
                                        <Field
                                            component="textarea"
                                            className="form-control"
                                            rows="3"
                                            name="text"
                                            placeholder="Comment"
                                        />
                                    </div>
                                    <div className="row mt-2">
                                        <div className="col text-center">
                                            {commentFormData.id === 0 ? (
                                                <button type="reset" className="btn btn-secondary" onClick={onClose}>
                                                    Cancel
                                                </button>
                                            ) : (
                                                <button
                                                    type="button"
                                                    className="btn btn-sm btn-link text-muted"
                                                    onClick={onClose}>
                                                    Close
                                                </button>
                                            )}
                                        </div>

                                        <div className="col text-center" style={{ justifyContent: 'right' }}>
                                            {commentFormData.id > 0 ? (
                                                <button type="submit" className="btn btn-primary">
                                                    Update
                                                </button>
                                            ) : (
                                                <button type="submit" className="btn btn-primary">
                                                    Add
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Form>
                </Formik>
            </div>
        </React.Fragment>
    );
}

AddEditAppointmentComment.propTypes = {
    currentUser: PropTypes.shape({
        id: PropTypes.number.isRequired,
        roles: PropTypes.arrayOf(PropTypes.string),
        email: PropTypes.string,
        isLoggedIn: PropTypes.bool,
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
    cardData: PropTypes.shape({
        isReplying: PropTypes.bool,
        isEditing: PropTypes.bool,
    }),
    refresh: PropTypes.func.isRequired,
    replyButton: PropTypes.func.isRequired,
    editButton: PropTypes.func,
    entityTypeId: PropTypes.number.isRequired,
    entityId: PropTypes.number.isRequired,
};

export default AddEditAppointmentComment;
