import PropTypes from 'prop-types';

const MentorDetailsProp = {
    avatarUrl: PropTypes.string,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    description: PropTypes.string,
    id: PropTypes.number.isRequired,
};

const UserBoxProp = {
    id: PropTypes.number.isRequired,
    userId: PropTypes.number,
    firstName: PropTypes.string,
    middleInitial: PropTypes.string,
    lastName: PropTypes.string,
    avatarUrl: PropTypes.string,
    email: PropTypes.string,
};

const AppointmentProp = {
    comments: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number,
            subject: PropTypes.string,
            text: PropTypes.string,
        })
    ),
    status: PropTypes.shape({
        id: PropTypes.number,
        name: PropTypes.string,
    }),
    type: PropTypes.shape({
        id: PropTypes.number,
        name: PropTypes.string,
    }),
    appointmentUrl: PropTypes.string,
    apptDateTime: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    firstName: PropTypes.string.isRequired,
    id: PropTypes.number,
    lastName: PropTypes.string.isRequired,
    imageUrl: PropTypes.string,
    mentorUserId: PropTypes.number,
};

const MenteeDashboardPageProp = {
    id: PropTypes.number,
};
export { MentorDetailsProp, UserBoxProp, AppointmentProp, MenteeDashboardPageProp };
