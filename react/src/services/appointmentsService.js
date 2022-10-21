import axios from 'axios';
import { API_HOST_PREFIX, onGlobalSuccess, onGlobalError } from '../services/serviceHelpers';

const appointmentServiceApi = `${API_HOST_PREFIX}/api/appointments`;

const getAppointments = (pageIndex, pageSize) => {
    const config = {
        method: 'GET',
        url: `${appointmentServiceApi}?pageIndex=${pageIndex}&pageSize=${pageSize}`,
        crossdomain: true,
        headers: {
            'Content-Type': 'application/json',
        },
    };
    return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

const getMentorAppts = (pageIndex, pageSize) => {
    const config = {
        method: 'GET',
        url: `${appointmentServiceApi}/mentorAppts?pageIndex=${pageIndex}&pageSize=${pageSize}`,
        crossdomain: true,
        headers: {
            'Content-Type': 'application/json',
        },
    };
    return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

const getApptsByDate = (pageIndex, pageSize, startDate, endDate) => {
    const config = {
    method: 'GET',
    url: `${appointmentServiceApi}/apptsbydate?pageIndex=${pageIndex}&pageSize=${pageSize}&startDate=${startDate}&endDate=${endDate}`,
    crossdomain: true,
    headers: {'Content-Type': 'application/json'},
    };
    return axios(config).then(onGlobalSuccess).catch(onGlobalError);
}

const deleteRelations = (id) => {
    const config = {
        method: 'DELETE',
        url: `${appointmentServiceApi}/permissions/${id}`,
        crossdomain: true,
        headers: { 'Content-Type': 'application/json' },
    };
    return axios(config);
};

const deleteRelationsV2 = (id) => {
    const config = {
        method: 'DELETE',
        url: `${appointmentServiceApi}/permissionsV2/${id}`,
        crossdomain: true,
        headers: { 'Content-Type': 'application/json' },
    };
    return axios(config);
};

const getAllMentorAppts = () => {
    const config = {
        method: 'GET',
        url: `${appointmentServiceApi}/mentorAllAppts`,
        crossdomain: true,
        headers: {
            'Content-Type': 'application/json',
        },
    };
    return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

const deleteAppt = (apptId, mentorId) => {
    const config = {
        method: 'DELETE',
        url: `${appointmentServiceApi}/delete?apptId=${apptId}&mentorId=${mentorId}`,
        crossdomain: true,
        headers: { 'Content-Type': 'application/json' },
    };
    return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

const cancelAppt = (id) => {
    const config = {
        method: 'PUT',
        url: `${appointmentServiceApi}/cancel/${id}`,
        crossdomain: true,
        headers: { 'Content-Type': 'application/json' },
    };
    return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

const appointmentService = {
    getAppointments,
    getMentorAppts,
    getApptsByDate,
    deleteRelations,
    deleteRelationsV2,
    getAllMentorAppts,
    deleteAppt,
    cancelAppt
};

export default appointmentService;
