using Sabio.Models;
using Sabio.Models.Domain.Appointment;
using Sabio.Models.Requests.Appointments;
using System;
using System.Collections.Generic;

namespace Sabio.Services
{
    public interface IAppointmentService
    {
        void Delete(int id);
        void CancelAppointment(int id);
        Paged<Appointment> GetAll(int pageIndex, int pageSize);
        Paged<Appointment> GetApptsByDate(int pageIndex, int pageSize, DateTime startDate, DateTime endDate);
        List<MentorAppointments> GetAllMentorAppts(int userId);
        Paged<Appointment> GetAppts(int pageIndex, int pageSize, int userId);
        int MenteeCreate(AppointmentAddRequest model, int userId);
        int MentorCreate(AppointmentAddRequest model, int userId);
        void Update(AppointmentUpdateRequest model);
        void CreateRelation(UserRelationAddRequest model, int userId);
        List<UserRelation> GetRelation(int userId);
        void DeleteRelation(int menteeId, int mentorId);
        void DeleteRelationV2(int menteeId, int mentorId);
        Paged<MentorAppointments> GetMentorAppts(int pageIndex, int pageSize, int userId);
    }
}
