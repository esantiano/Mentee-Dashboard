import React from 'react';
import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { AppointmentProp } from './menteeDashboardPropTypes';
import { Row } from 'react-bootstrap';
import 'toastr/build/toastr.css';
import AppointmentComments from "../comments/appointmentcomments/AppointmentComments"
import debug from 'sabio-debug';
import "./appointmentcard.css"

const _logger = debug.extend('AppointmentCard');

function Appointment(props) {
    _logger(props)
    const date = moment(props.apptDateTime + 'Z').format('D MMM YYYY');
    const time = moment(props.apptDateTime + 'Z').format('hh:mm');

    const onCancel = () => {
        props.onCancelAppointment(props.id)
    } 

    if (!props) {
        return <p>You have no appointments!</p>;
    } else {
        _logger('returning appointment Card');
        return (
            <Card className="shadow p-2 mb-5 bg-white rounded">
                <Row className="appointment-row-one">
                    <div className="col-lg-4 p-2 timeline-item-info text-center">
                        <h3 className="text-info text-right fw-bold mb-1 d-block">{props.type?.name}</h3>
                        <h5 className={'text-right'}>{props.description}</h5>
                        <h5 className="text-right mb-0 pb-2 text-muted">
                            {date} at {time}
                        </h5>
                    </div>

                    <div className="text-center col-lg-4 p-2">
                        <h4>
                            {props.firstName} {props.lastName}
                        </h4>
                        <img src={props.imageUrl} className="rounded-circle avatar-lg img-thumbnail" alt="" />
                    </div>
                    <div className="col-lg-4 p-2 text-center">
                        <h3>
                            <Link to="/dashboard/profiles" className="btn btn-info appointment-button btn-sm mb-2">
                                Go To Profile
                            </Link>
                        </h3>
                        <h3>
                            <button to="#" className="btn btn-warning appointment-button btn-sm mb-2"
                            onClick={onCancel}>
                                Cancel Appointment
                            </button>
                        </h3>
                    </div>
                </Row>
                <AppointmentComments currentUser={props.currentUser} appointmentId={props.id} />
            </Card>
        );
    }
}

Appointment.propTypes = AppointmentProp;
export default Appointment;
