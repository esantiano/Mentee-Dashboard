import axios from 'axios';
import { API_HOST_PREFIX, onGlobalSuccess, onGlobalError } from './serviceHelpers';
import debug from 'sabio-debug'

const _logger = debug.extend('menteeDashboardServices');

const menteeDashboardApi ={endpoint: `${API_HOST_PREFIX}/api/mentee/dashboard`}

const addAppointmentComment = (payload) => {
    _logger('addAppointmentComment firing', menteeDashboardApi)
    const config = {
        method: 'POST',
        url:menteeDashboardApi.endpoint,
        data: payload,
        crossdomain: true, 
        withCredentials: true,
        headers: { 'Content-Type': 'application/json'},
    };
    return axios(config).then(onGlobalSuccess).catch(onGlobalError);
}

const getInformation = (id) => {
    _logger('getInformation firing', menteeDashboardApi)
    const config = {
        method: 'GET',
        url:`${menteeDashboardApi.endpoint}/profile/${id}`,
        crossdomain: true, 
        withCredentials: true,
        headers: { 'Content-Type': 'application/json'},
    };
    return axios(config).then(onGlobalSuccess).catch(onGlobalError);
}
const getMentorMatches = (id) => {
    _logger('getMentorMatches firing', menteeDashboardApi)
    const config = {
        method: 'GET',
        url:`${menteeDashboardApi.endpoint}/matches/${id}`,
        crossdomain: true, 
        withCredentials: true,
        headers: { 'Content-Type': 'application/json'},
    };
    return axios(config).then(onGlobalSuccess).catch(onGlobalError);
}

const getMenteeAppointments = (id) => {
    _logger('getMenteeAppoinments firing', menteeDashboardApi)
    const config = {
        method: 'GET',
        url:`${menteeDashboardApi.endpoint}/appointments/${id}`,
        crossdomain: true, 
        withCredentials: true,
        headers: { 'Content-Type': 'application/json'},
    };
    return axios(config).then(onGlobalSuccess).catch(onGlobalError);
}

const getProfileInformation = (id) => {
        _logger('getMenteeAppoinments firing', menteeDashboardApi)
        const config = {
            method: 'GET',
            url:`${menteeDashboardApi.endpoint}/${id}`,
            crossdomain: true, 
            withCredentials: true,
            headers: { 'Content-Type': 'application/json'},
        };
        return axios(config).then(onGlobalSuccess).catch(onGlobalError);
}

const menteeDashboardService = {getMenteeAppointments, getMentorMatches, getProfileInformation, getInformation, addAppointmentComment }
export default menteeDashboardService;