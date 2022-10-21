import React, { useEffect, useState } from 'react';
import appointmentService from '../../services/appointmentsService';

import SimpleBar from 'simplebar-react';
import moment from 'moment';

import debug from 'sabio-debug';
const _logger = debug.extend('appointmentCard');

function AppointmentsCard() {
    const [state, setState] = useState();

    useEffect(() => {
        appointmentService.getAppointments(0, 5).then(onGetAppointmentsSuccess).catch(onGetAppointmentsError);
    }, []);

    const onGetAppointmentsSuccess = (response) => {
        _logger(response.data.item.pagedItems[0]);
        setState(() => {
            let newState = response.data.item.pagedItems.map(mapAppointmentElements);
            return newState;
        });
    };

    const mapAppointmentElements = (appt) => {
        const date = moment(appt.apptDateTime + 'Z').format('D MMM YYYY');
        const time = moment(appt.apptDateTime + 'Z').format('hh:mm');
        return (
            <div className=" col-md-6" key={`appointment_${appt.id}`}>
                <div className="timeline-item-info">
                    <h3 className="text-info fw-bold mb-1 d-block">{appt.apptType}</h3>
                    <h5>{appt.description}</h5>
                    <h5 className="mb-0 pb-2 text-muted">
                        {date} at {time}
                    </h5>
                </div>
                <div className="col-md-6 p-2">
                    <h4>Mentor: {appt.mentorId}</h4>
                    <h4>Mentee: {appt.menteeId}</h4>
                </div>
            </div>
        );
    };

    const onGetAppointmentsError = (response) => {
        _logger(response);
    };

    return (
        <>
            <div className="row">
                <h2 className="text-secondary m-2">My Appointments</h2>
                <hr />
                <SimpleBar className="px-3" style={{ maxHeight: '337px', width: '100%' }}>
                    {state && state}
                    {!state && <h3>Loading Appointments...</h3>}
                </SimpleBar>
            </div>
        </>
    );
}

export default AppointmentsCard;
