import axios from 'axios';
import { API_HOST_PREFIX, onGlobalSuccess, onGlobalError } from './serviceHelpers';
import debug from 'sabio-debug';

const commentApi = `${API_HOST_PREFIX}/api/comments`;

const _logger = debug.extend('commentsService');

const addComment = (payload) => {
    _logger('addComment executing');
    const config = {
        method: 'POST',
        url: `${commentApi}`,
        data: payload,
        crossdomain: true,
        withCredentials: true,
        headers: { 'Content-Type': 'application/json' },
    };
    return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

const editComment = (id, payload) => {
    _logger('editComment executing');
    const config = {
        method: 'PUT',
        url: `${commentApi}/${id}`,
        crossdomain: true,
        data: payload,
        withCredentials: true,
        headers: { 'Content-Type': 'application/json' },
    };
    return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

const updateCommentStatus = (id, payload) => {
    _logger('updateCommentStatus executing');
    const config = {
        method: 'PUT',
        url: `${commentApi}/status/${id}`,
        crossdomain: true,
        data: payload,
        withCredentials: true,
        headers: { 'Content-Type': 'application/json' },
    };
    return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

const getCommentsById = (payload) => {
    _logger('getCommentsById executing');
    const config = {
        method: 'GET',
        url: `${commentApi}/createdby`,
        crossdomain: true,
        data: payload,
        withCredentials: true,
        headers: { 'Content-Type': 'application/json' },
    };
    return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

const getComments = (entityTypeId, entityId, pageIndex, pageSize) => {
    _logger('getComments executing');
    const config = {
        method: 'GET',
        url: `${commentApi}/paginate/?pageIndex=${pageIndex}&pageSize=${pageSize}&entityTypeId=${entityTypeId}&entityId=${entityId}`,
        crossdomain: true,
        headers: { 'Content-Type': 'application/json' },
    };
    return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

const commentService = {
    addComment,
    editComment,
    updateCommentStatus,
    getCommentsById,
    getComments,
};

export default commentService;
