import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Tab, Card, Nav, Button } from 'react-bootstrap';
import SimpleBar from 'simplebar-react';
import { Formik, Form, Field } from 'formik';
import AppointmentCard from '../../../components/dashboardmentee/AppointmentCard';
import MentorDetails from '../../../components/dashboardmentee/MentorDetails';
import menteeDashboardService from '../../../services/menteeDashboardService';
import userProfileService from '../../../services/userProfilesService';
import appointmentService from '../../../services/appointmentsService';
import { MenteeDashboardPageProp } from '../../../components/dashboardmentee/menteeDashboardPropTypes';
import * as toastr from 'toastr';
import Modal from "react-modal";
import Calendly from '../../../components/calendly/Calendly';
import 'toastr/build/toastr.css';
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faGoogle, faTwitter, faGithub } from '@fortawesome/free-brands-svg-icons';
import FileUploader from '../../../components/files/FileUploader';
import { formValidationSchema } from '../../../schema/userProfileEditFormSchema';
import calendarService from '../../../services/calendlyService';

import debug from 'sabio-debug';

const _logger = debug.extend('MenteeDashboard');


function MenteeDashboardPage(props) {
    const [userUrl, setUserUrl] = useState("");
    const [modalIsOpen, setModalIsOpen] = useState(false);

    const openModal = () => {
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
    };

    const [dashboardData, setDashboardData] = useState({
        id: 0,
        metaData: { firstName: '', lastName: '', mi: '', avatarUrl: '' },
        arrayOfMentors: [],
        mappedMentorComponents: [],
        appointments: [],
        mappedAppointments: [],
        apptData: {
            old:[],
            upcoming:[]
        }
    }, []);

    const [profileFormData, setProfileFormData] = useState({
        id: props.currentUser.id,
        metaData: { firstName: '', mi: '',lastName: '', avatarUrl: '' },
    });

    useEffect(() => {
        menteeDashboardService.getInformation(props.currentUser.id).then(onGetInfoSuccess).catch(onGetInfoError);
    }, []);

    _logger(dashboardData);

    const onGetInfoSuccess = (response) => {
        toastr.success('User information retrieval success');
        let mentorsArray = response.item.matchedMentors;
        let arrayOfAppointments = response.item.appointments;

        setDashboardData((prevState) => {
            _logger('setDashboardData:', response.item);
            let dd = { ...prevState };
            dd.metaData.firstName = response.item.profile.firstName;
            dd.metaData.mi = response.item.profile.middleInitial;
            dd.metaData.lastName = response.item.profile.lastName;
            dd.metaData.avatarUrl = response.item.profile.avatarUrl;
            dd.id = response.item.profile.id;

            dd.arrayOfMentors = mentorsArray;
            dd.mappedMentorComponents = mentorsArray.map(mapMentor);

            dd.appointments = arrayOfAppointments;
            dd.mappedAppointments = arrayOfAppointments.map(mapAppointment);

            dd.appointments.forEach((appt) => {
                const date = appt.apptDateTime;

                if (new Date(date) >= new Date()) {
                    dd.apptData?.upcoming.push(appt);
                } else dd.apptData?.old.push(appt);
            });

            dd.apptData?.old.sort((a, b) => new Date(b.apptDateTime) - new Date(a.apptDateTime))
            dd.apptData?.upcoming.sort((a, b) => new Date(a.apptDateTime) - new Date(b.apptDateTime));
            dd.mappedOld = dd.apptData?.old.map(mapAppointment);
            dd.mappedUpcoming = dd.apptData?.upcoming.map(mapAppointment);
            return dd;
        });
    };

    const onGetInfoError = (err) => {
        _logger('Information retrieval error', err);
        toastr.error('User information retrieval error');
        return null;
    };

    const mapMentor = (mentor) => {
        if (!mentor) {
            return;
        }
        return (
            <MentorDetails
                key={mentor.userId}
                avatarUrl={mentor.imageUrl}
                firstName={mentor.firstName}
                lastName={mentor.lastName}
                description={mentor.description}
                id={mentor.id}
                props={mentor}
                onRemoveMentor={onRemoveMentor}
            />
        );
    };

    const mapAppointment = (appointment) => {
        _logger('mapping appointment,', appointment);
        if (!appointment) {
            return;
        }
        return (
            <AppointmentCard
                key={appointment.mentorUserId}
                comments={appointment.appointmentComments}
                status={appointment.appointmentStatus}
                type={appointment.appointmentType}
                appointmentUrl={appointment.appointmentUrl}
                apptDateTime={appointment.apptDateTime}
                description={appointment.description}
                firstName={appointment.firstName}
                id={appointment.id}
                lastName={appointment.lastName}
                imageUrl={appointment.imageUrl}
                currentUser={props.currentUser}
                onCancelAppointment={onCancelAppointment}
            />
        );
    };

    const onHandleUploadSuccess = (response, setFieldValue) => {
        _logger('onHandleUploadSuccess url', response[0].url);
        setFieldValue('avatarUrl', response[0].url);
    };

    const onRemoveMentor = (mentorId) => {
        _logger('onRemoveMentor', mentorId);
        Swal.fire({
            title: 'Unmatch Mentor',
            text: 'Are you sure you want to unmatch?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes',
        }).then((result) => {
            if (result.isConfirmed) {
                appointmentService.deleteRelationsV2(mentorId).then(onRemoveMentorSuccess).catch(onRemoveMentorError);
            }
        });
    };

    const onRemoveMentorSuccess = (response) => {
        _logger('onDeleteRelationSuccess', response);
        toastr.success('Unmatch successful');
    };

    const onRemoveMentorError = (err) => {
        _logger('onDeleteRelationFailure', err);
        toastr.error('Unmatch unsuccessful');
    };

    const onCancelAppointment = (apptId) => {
        _logger('onCancelAppointment firing:', apptId);
        Swal.fire({
            title: 'Cancel Appointment',
            text: 'Are you sure you want to cancel?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes',
        }).then((result) => {
            if (result.isConfirmed) {
                appointmentService.cancelAppt(apptId).then(onCancelAppointmentSuccess).catch(onCancelAppointmentError);
            }
        });
    };

    const onCancelAppointmentSuccess = (response) => {
        _logger('onCancelAppointmentSuccess', response);
        toastr.success('Appointment successfully canceled.');
    };

    const onCancelAppointmentError = (err) => {
        _logger('onCancelAppointmentError', err);
        toastr.error('Could not cancel appointment.');
    };

    const handleSubmit = (values) => {
        let payload = values;
        Swal.fire({
            title: !dashboardData.id ? 'Please Confirm Registration' : 'Please Confirm Update',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Confirm',
        }).then((result) => {
            if (result.isConfirmed) {
                userProfileService
                    .updateById(profileFormData.id, payload)
                    .then(onEditProfileSuccess)
                    .catch(onEditProfileError);
            }
        });
    };

    const onEditProfileSuccess = (response) => {
        _logger('onEditProfileSuccess', response);
        setProfileFormData((prevState) => {
            const newProfileObject = {
                ...prevState,
            };
            newProfileObject.id = response.id;
            return newProfileObject;
        });
        toastr.success('User Profile has been successufully updated');
        Swal.fire('Update Complete', 'Your profile has been updated.', 'success');
    };

    const onEditProfileError = (err) => {
        _logger('onEditProfileError', err);
        toastr.error('Unable to update profile');
    };

    useEffect(() => {
        calendarService.getCurrentUserMentee().then(onGetCurrUserSuccess).catch(onGetCurrUserError);
    }, []);


    const onGetCurrUserSuccess = ({ item: { resource } }) => {
        if (resource) {

            setUserUrl(resource?.scheduling_url)
        }
    };

    const onGetCurrUserError = () => {
        toastr.error("Could not get Calendly User")
    };

    return (
        <>
            <Row>
                <Col>
                    <div className="page-title-box">
                        <div className="page-title-right">
                            <form className="d-flex">
                                <div className="input-group"></div>
                            </form>
                        </div>
                        <h4 className="page-title">Mentee Dashboard</h4>
                    </div>
                </Col>
            </Row>

            <Row>
                <Col xl={3} lg={5}>
                    <Formik
                        enableReinitialize={true}
                        initialValues={dashboardData.metaData}
                        onSubmit={handleSubmit}
                        validationSchema={formValidationSchema}>
                        {({ values }) => (
                            <Card>
                                <Card.Body>
                                    <div className="text-center">
                                        <img
                                            src={values.avatarUrl ? values.avatarUrl : 'https://bit.ly/3wSLYqv'}
                                            className="rounded-circle avatar-lg img-thumbnail"
                                            alt=""
                                        />
                                    </div>
                                    <h4 className="text-center mb-0 mt-2">
                                        {values.firstName} {values.mi} {values.lastName}
                                    </h4>
                                    <p />
                                    <div className="text-start mt-3">
                                        <h4 className="font-13 text-uppercase">About Me :</h4>
                                        <p className="text-muted font-13 mb-3">
                                            Hi I am {values.firstName} {values.lastName}. I have 100 years of software
                                            enginnering experience and I aspire to go time travel one day and meet
                                            myself.
                                        </p>
                                        <p className="text-muted mb-2 font-13">
                                            <strong>Full Name :</strong>
                                            <span className="ms-2">
                                                {values.firstName} {values.mi} {values.lastName}
                                            </span>
                                        </p>

                                        <p className="text-muted mb-2 font-13">
                                            <strong>Mobile :</strong>
                                            <span className="ms-2">(123) 123 1234</span>
                                        </p>

                                        <p className="text-muted mb-2 font-13">
                                            <strong>Email :</strong>
                                            <span className="ms-2 ">user@email.domain</span>
                                        </p>

                                        <p className="text-muted mb-1 font-13">
                                            <strong>Location :</strong>
                                            <span className="ms-2">USA</span>
                                        </p>
                                    </div>
                                    <div className="text-center">
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
                                                <Link
                                                    to="#"
                                                    className="social-list-item border-secondary text-secondary">
                                                    <FontAwesomeIcon icon={faGithub} />
                                                </Link>
                                            </li>
                                        </ul>
                                    </div>
                                </Card.Body>
                            </Card>
                        )}
                    </Formik>
                </Col>

                <Col xl={9} lg={5}>
                    <Tab.Container defaultActiveKey="upcomingAppts">
                        <Card>
                            <Card.Body>
                                <Nav variant="pills" className="nav nav-pills bg-nav-pills nav-justified mb-3">
                                    <Nav.Item className="nav-item">
                                        <Nav.Link href="#" eventKey="upcomingAppts" className="nav-link rounded-0">
                                            Upcoming Appointments
                                        </Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item className="nav-item">
                                        <Nav.Link href="#" eventKey="pastAppts" className="nav-link rounded-0">
                                            Past Appointments
                                        </Nav.Link>
                                    </Nav.Item>

                                    <Nav.Item className="nav-item">
                                        <Nav.Link href="#" eventKey="matches" className="nav-link rounded-0">
                                            Matches
                                        </Nav.Link>
                                    </Nav.Item>

                                    <Nav.Item className="nav-item">
                                        <Nav.Link href="#" eventKey="editprofile" className="nav-link rounded-0">
                                            Edit Profile
                                        </Nav.Link>
                                    </Nav.Item>
                                </Nav>

                                <Tab.Content>

                                    <Tab.Pane eventKey="upcomingAppts">
                                        <Row>
                                            <h2 className="text-center m-2">Upcoming Appointments</h2>
                                        </Row>
                                        <SimpleBar
                                            className="upcomingAppts"
                                            style={{ maxHeight: '600px', width: '100%' }}>
                                            <Row>
                                                {dashboardData.mappedUpcoming && dashboardData.mappedUpcoming}
                                                {!dashboardData.mappedUpcoming && <h3>Loading Appointments...</h3>}
                                            </Row>
                                        </SimpleBar>
                                        <Button onClick={openModal}>Create Appointment</Button>
                                        <Modal
                                            isOpen={modalIsOpen}
                                            onRequestClose={closeModal}
                                            contentLabel="Set new appointment"
                                            ariaHideApp={false}
                                        >
                                            <Button onClick={closeModal}>Cancel</Button>
                                            <Calendly ownerUrl={userUrl} />
                                        </Modal>
                                    </Tab.Pane>
                                </Tab.Content>

                                <Tab.Content>
                                    <Tab.Pane eventKey="pastAppts">
                                        <h2 className="text-center m-2">Past Appointments</h2>
                                        <SimpleBar className="pastAppts" style={{ maxHeight: '600px', width: '100%' }}>
                                            <Row>
                                                {dashboardData.mappedOld && dashboardData.mappedOld}
                                                {!dashboardData.mappedOld && <h3>Loading Appointments...</h3>}
                                            </Row>
                                        </SimpleBar>
                                        <Button onClick={openModal}>Create Appointment</Button>
                                        <Modal
                                            isOpen={modalIsOpen}
                                            onRequestClose={closeModal}
                                            contentLabel="Set new appointment"
                                            ariaHideApp={false}
                                        >
                                            <Button onClick={closeModal}>Cancel</Button>
                                            <Calendly ownerUrl={userUrl} />
                                        </Modal>
                                    </Tab.Pane>
                                </Tab.Content>

                                <Tab.Content>
                                    <Tab.Pane eventKey="matches">
                                        <h2 className="text-center m-2">Matches</h2>
                                        <div className="row">{dashboardData.mappedMentorComponents}</div>
                                    </Tab.Pane>
                                </Tab.Content>

                                <Tab.Content>
                                    <Tab.Pane eventKey="editprofile">
                                        <div className="row mt-3" />
                                        <h2 className="text-center m-2">User Profile Information</h2>
                                        <div className="row mt-3" />
                                        <Formik
                                            enableReinitialize={true}
                                            initialValues={dashboardData.metaData}
                                            onSubmit={handleSubmit}
                                            validationSchema={formValidationSchema}>
                                            {({ touched, errors, setFieldValue }) => (
                                                <Form>
                                                    <label
                                                        htmlFor="firstName"
                                                        className="w-75"
                                                        style={{ textAlign: 'left' }}>
                                                        First Name
                                                    </label>
                                                    <Field
                                                        type="text"
                                                        name="firstName"
                                                        className="form-control mt-1 w-75 mx-auto"
                                                    />
                                                    {touched.firstName && errors.firstName && (
                                                        <div
                                                            className="text-danger w-50"
                                                            style={{ alignContent: 'left', paddingLeft: '2.3rem' }}>
                                                            {errors.firstName}
                                                        </div>
                                                    )}
                                                    <label
                                                        htmlFor="mi"
                                                        className="my-1 w-75"
                                                        style={{ textAlign: 'left' }}>
                                                        Middle Initial
                                                    </label>
                                                    <Field
                                                        type="text"
                                                        name="mi"
                                                        className="form-control w-75 mx-auto"
                                                    />
                                                    <label
                                                        htmlFor="lastName"
                                                        className="my-1 w-75"
                                                        style={{ textAlign: 'left' }}>
                                                        Last Name
                                                    </label>
                                                    <Field
                                                        type="text"
                                                        name="lastName"
                                                        className="form-control w-75 mx-auto"
                                                    />
                                                    {touched.lastName && errors.lastName && (
                                                        <div
                                                            className="text-danger w-50"
                                                            style={{ alignContent: 'left', paddingLeft: '2.3rem' }}>
                                                            {errors.lastName}
                                                        </div>
                                                    )}

                                                    <div className="row mt-4" />
                                                    <label htmlFor="url" className="form-label text-left">
                                                        Profile Image
                                                    </label>
                                                    <div className="row mt-1" />
                                                    <div className="px-2">
                                                        <FileUploader
                                                            onHandleUploadSuccess={(response) =>
                                                                onHandleUploadSuccess(response, setFieldValue)
                                                            }
                                                            isMultilple={true}
                                                        />
                                                    </div>
                                                    {touched.avatarUrl && errors.avatarUrl && (
                                                        <div className="text-danger">{errors.avatarUrl}</div>
                                                    )}
                                                    <div className="row mt-4" />
                                                    <Button
                                                        className="btn-primary"
                                                        variant="contained"
                                                        color="primary"
                                                        type="submit">
                                                        {!dashboardData.id ? 'Add' : 'Update'}
                                                    </Button>
                                                </Form>
                                            )}
                                        </Formik>
                                    </Tab.Pane>
                                </Tab.Content>
                            </Card.Body>
                        </Card>
                    </Tab.Container>
                </Col>
            </Row>
        </>
    );
}
MenteeDashboardPage.propTypes = MenteeDashboardPageProp;
export default MenteeDashboardPage;
