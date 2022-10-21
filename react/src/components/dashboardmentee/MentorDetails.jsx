import React from 'react';
import { Card, CloseButton, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faGoogle, faTwitter, faGithub } from '@fortawesome/free-brands-svg-icons';
import { MentorDetailsProp } from './menteeDashboardPropTypes';
import usersServices from '../../services/usersServices';
import mentorService from '../../services/mentorService';
import Swal from 'sweetalert2';
import toastr from 'toastr';
import './mentordetail.css';
import debug from 'sabio-debug';

import 'toastr/build/toastr.css';

const _logger = debug.extend('MentorDetail');

const mapFunc = (item) => {
    return (
        <span className={`font-13 pill-${Math.floor(item.id % 10)}`} key={item.id}>
            {item.name}
        </span>
    );
};

const phoneNumberConvert = (tenDigitNum) => {
    const numString = tenDigitNum.toString();
    const firstThree = numString.slice(0, 3);
    const secondThree = numString.slice(3, 6);
    const lastFour = numString.slice(6, 10);
    const phoneNumber = `${firstThree}-${secondThree}-${lastFour}`;
    return phoneNumber;
};

const MentorDetails = (mentor) => {
    _logger('Creating mentor card:', mentor);

    const onSurveyClick = (e) => {
        _logger('onSubmitClick Firing', e.target.value, { syntheticEvent: e });
        const targetId = e.target.value;
        Swal.fire({
            title: 'Please confirm',
            text: 'Would you like to email a survey to this mentor?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes',
        }).then((result) => {
            if (result.isConfirmed) {
                usersServices.getUserById(targetId).then(onGetCurrentSuccess).catch(onGetCurrentError);
            }
        });
    };

    const onGetCurrentSuccess = (res) => {
        const targetEmail = res.data.item.email;
        _logger('onGetCurrentSuccess', targetEmail);
        const targetObject = {
            fullName: `${mentor.firstName} ${mentor.lastName}`,
            email: targetEmail,
            path: '/surveys/forms/130',
        };
        mentorService.sendSurveyEmail(targetObject).then(onSurveySuccess).catch(onSurveyError);
    };

    const onGetCurrentError = () => {
        toastr['error'](`Sorry, I am having trouble locating this mentee.`);
    };

    const onSurveySuccess = () => {
        toastr['success']('Email successfully sent.');
    };

    const onSurveyError = () => {
        toastr['error']('Sorry, something went wrong.');
    };

    const onRemoval = () => {
        onRemoveMentor(mentor.props.userId);
    };
    const onRemoveMentor = (id) => {
        _logger('onRemoveMentor', id);
        mentor.onRemoveMentor(id);
    };

    return (
        <React.Fragment>
            <div className="col-sm-4">
                <Card className="text-center">
                    <CloseButton onClick={onRemoval} />
                    <Card.Body key={mentor.props.id} useridkey={mentor.props.userId}>
                        <img src={mentor.props.imageUrl} className="rounded-circle avatar-lg img-thumbnail" alt="" />
                        <h4 className="mb-0 mt-2">
                            {mentor.props.firstName} {mentor.props.lastName}
                        </h4>
                        <div className="mt-1 mb-1">
                            <div className="font-13">
                                <strong>Place Holder</strong>
                            </div>
                            <div className="font-13 ">
                                <span className="ms-2">Cell Phone: {phoneNumberConvert(mentor.props.phoneNumber)}</span>
                            </div>
                        </div>
                        <Link to="/daily" className="btn btn-success btn-sm mb-2">
                            Zoom
                        </Link>{' '}
                        <Button
                            className="btn btn-danger btn-sm mb-2 mx-1"
                            onClick={onSurveyClick}
                            value={mentor.props.userId}>
                            Survey
                        </Button>
                        <div className="text-start mt-3">
                            <h4 className="font-13 text-uppercase">About Me :</h4>
                            <p className="text-muted font-13 mb-3">{mentor.props.description}</p>

                            <p className="text-muted mb-2 font-13">
                                <strong>Email :</strong>
                                <span className="ms-2 ">placeholder email</span>
                            </p>

                            <p className="text-muted mb-1 font-13">
                                <strong>Location :</strong>
                                <span className="ms-2">USA</span>
                            </p>

                            <p className="text-muted mb-1 font-13">
                                <strong>Focus Areas :</strong>
                                <span className="ms-2">{mentor.props.focusAreas?.map(mapFunc)}</span>
                            </p>

                            <p className="text-muted mb-1 font-13">
                                <strong>Gender :</strong>
                                <span className="ms-2">{mentor.props.genderTypes?.map(mapFunc)}</span>
                            </p>

                            <p className="text-muted mb-1 font-13">
                                <strong>Grades :</strong>
                                <span className="ms-2">{mentor.props.grades?.map(mapFunc)}</span>
                            </p>

                            <p className="text-muted mb-1 font-13">
                                <strong>Mentoring Types :</strong>
                                <span className="ms-2">{mentor.props.mentoringTypes?.map(mapFunc)}</span>
                            </p>

                            <p className="text-muted mb-1 font-13">
                                <strong>Specialties :</strong>
                                <span className="ms-2">{mentor.props.specialties?.map(mapFunc)}</span>
                            </p>
                        </div>
                        <ul className="social-list list-inline mt-3 mb-0">
                            <li className="list-inline-item">
                                <Link to="#" className="social-list-item border-primary text-primary">
                                    <FontAwesomeIcon icon={faFacebook} />
                                </Link>
                            </li>
                            <li className="list-inline-item">
                                <Link to="#" className="social-list-item border-danger text-danger">
                                    <FontAwesomeIcon icon={faGoogle} />
                                </Link>
                            </li>
                            <li className="list-inline-item">
                                <Link to="#" className="social-list-item border-info text-info">
                                    <FontAwesomeIcon icon={faTwitter} />
                                </Link>
                            </li>
                            <li className="list-inline-item">
                                <Link to="#" className="social-list-item border-secondary text-secondary">
                                    <FontAwesomeIcon icon={faGithub} />
                                </Link>
                            </li>
                        </ul>
                    </Card.Body>
                </Card>
            </div>
        </React.Fragment>
    );
};

MentorDetails.propTypes = MentorDetailsProp;

export default MentorDetails;
