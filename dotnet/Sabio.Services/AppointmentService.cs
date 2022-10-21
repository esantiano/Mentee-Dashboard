using Sabio.Data;
using Sabio.Data.Providers;
using Sabio.Models;
using Sabio.Models.Domain.Appointment;
using Sabio.Models.Requests.Appointments;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Services
{
    public class AppointmentService : IAppointmentService
    {

        IDataProvider _data = null;

        public AppointmentService(IDataProvider data)
        {
            _data = data;
        }

        public Paged<Appointment> GetAll(int pageIndex, int pageSize)
        {
            List<Appointment> list = null;

            Paged<Appointment> pagedObject = null;

            string proc = "[dbo].[Appointments_SelectAll]";

            int totalCount = 0;

            _data.ExecuteCmd(proc
                , inputParamMapper: delegate (SqlParameterCollection collection)
                {
                    collection.AddWithValue("@PageIndex", pageIndex);
                    collection.AddWithValue("@PageSize", pageSize);
                }
            , singleRecordMapper: delegate (IDataReader reader, short set)
            {
                int startingIndex = 0;

                Appointment appointment = MapSingleAppointment(reader, ref startingIndex);

                if (totalCount == 0)
                {
                    totalCount = reader.GetSafeInt32(startingIndex++);
                }

                if (list == null)
                {
                    list = new List<Appointment>();
                }

                list.Add(appointment);

            });
            if (list != null)
            {

                pagedObject = new Paged<Appointment>(list, pageIndex, pageSize, totalCount);
            }

            return pagedObject;
        }

        public List<MentorAppointments> GetAllMentorAppts(int userId)
        {
            List<MentorAppointments> list = null;


            string proc = "[dbo].[Appointments_SelectAllV2]";

            int totalCount = 0;

            _data.ExecuteCmd(proc
                , inputParamMapper: delegate (SqlParameterCollection collection)
                {
                    collection.AddWithValue("@userId", userId);
                }
            , singleRecordMapper: delegate (IDataReader reader, short set)
            {
                int startingIndex = 0;

                MentorAppointments appointments = MapMentorAppointments(reader, ref startingIndex);

                if (totalCount == 0)
                {
                    totalCount = reader.GetSafeInt32(startingIndex++);
                }

                if (list == null)
                {
                    list = new List<MentorAppointments>();
                }

                list.Add(appointments);

            });
            return list;
        }

        public Paged<Appointment> GetAppts(int pageIndex, int pageSize, int userId)
        {

            List<Appointment> list = null;

            Paged<Appointment> pagedObject = null;

            string proc = "[dbo].[Appointments_Select_ByUserId]";

            int totalCount = 0;

            _data.ExecuteCmd(proc
                , inputParamMapper: delegate (SqlParameterCollection collection)
                {
                    collection.AddWithValue("@UserId", userId);
                    collection.AddWithValue("@PageIndex", pageIndex);
                    collection.AddWithValue("@PageSize", pageSize);
                }
            , singleRecordMapper: delegate (IDataReader reader, short set)
            {
                int startingIndex = 0;

                Appointment appointment = MapSingleAppointment(reader, ref startingIndex);

                if (totalCount == 0)
                {
                    totalCount = reader.GetSafeInt32(startingIndex++);
                }

                if (list == null)
                {
                    list = new List<Appointment>();
                }

                list.Add(appointment);

            });
            if (list != null)
            {

                pagedObject = new Paged<Appointment>(list, pageIndex, pageSize, totalCount);
            }

            return pagedObject;
        }

        public Paged<Appointment> GetApptsByDate(int pageIndex, int pageSize, DateTime startDate, DateTime endDate)
        {
            List<Appointment> list = null;

            Paged<Appointment> pagedObject = null;

            string proc = "[dbo].[Appointments_SelectByDate_Paginated]";

            int totalCount = 0;

            _data.ExecuteCmd(proc
                , inputParamMapper: delegate (SqlParameterCollection collection)
                {
                    collection.AddWithValue("@PageIndex", pageIndex);
                    collection.AddWithValue("@PageSize", pageSize);
                    collection.AddWithValue("@StartDate", startDate);
                    collection.AddWithValue("@EndDate", endDate);
                }
            , singleRecordMapper: delegate (IDataReader reader, short set)
            {
                int startingIndex = 0;

                Appointment appointment = MapSingleAppointment(reader, ref startingIndex);

                if (totalCount == 0)
                {
                    totalCount = reader.GetSafeInt32(startingIndex++);
                }

                if (list == null)
                {
                    list = new List<Appointment>();
                }

                list.Add(appointment);

            });
            if (list != null)
            {

                pagedObject = new Paged<Appointment>(list, pageIndex, pageSize, totalCount);
            }

            return pagedObject;
        }

        public int MentorCreate(AppointmentAddRequest model, int userId)
        {
            int Id = 0;

            string procName = "[dbo].[Appointments_Insert]";

            _data.ExecuteNonQuery(procName
                , inputParamMapper: delegate (SqlParameterCollection col)
                {
                    AddCommonParams(model, col);
                    col.AddWithValue("@MenteeId", model.MenteeId);
                    col.AddWithValue("@MentorId", userId);

                    SqlParameter idOut = new SqlParameter("@Id", SqlDbType.Int);
                    idOut.Direction = ParameterDirection.Output;

                    col.Add(idOut);
                }
                 , returnParameters: delegate (SqlParameterCollection returnCollection)
                 {
                     object oId = returnCollection["@Id"].Value;
                     int.TryParse(oId.ToString(), out Id);
                 }
                 );

            return Id;
        }

        public int MenteeCreate(AppointmentAddRequest model, int userId)
        {
            int Id = 0;

            string procName = "[dbo].[Appointments_Insert]";

            _data.ExecuteNonQuery(procName
                , inputParamMapper: delegate (SqlParameterCollection col)
                {
                    AddCommonParams(model, col);
                    col.AddWithValue("@MentorId", model.MentorId);
                    col.AddWithValue("@MenteeId", userId);

                    SqlParameter idOut = new SqlParameter("@Id", SqlDbType.Int);
                    idOut.Direction = ParameterDirection.Output;

                    col.Add(idOut);
                }
                 , returnParameters: delegate (SqlParameterCollection returnCollection)
                 {
                     object oId = returnCollection["@Id"].Value;
                     int.TryParse(oId.ToString(), out Id);
                 }
                 );

            return Id;
        }

        public void Update(AppointmentUpdateRequest model)
        {
            string procName = "[dbo].[Appointments_Update]";

            _data.ExecuteNonQuery(procName
                , inputParamMapper: delegate (SqlParameterCollection col)
                {

                    AddCommonParams(model, col);

                    col.AddWithValue("@Id", model.Id);

                }
                 , returnParameters: null
                 );
        }

        public void Delete(int id)
        {
            string procName = "[dbo].[Appointments_Delete]";

            _data.ExecuteNonQuery(procName
                , inputParamMapper: delegate (SqlParameterCollection col)
                {
                    col.AddWithValue("@Id", id);
                }
            , returnParameters: null
            );
        }

        public void CancelAppointment(int id)
        {
            string procName = "[dbo].[Appointments_Delete_ById]";

            _data.ExecuteNonQuery(procName
                , inputParamMapper: delegate (SqlParameterCollection col)
                {
                    col.AddWithValue("@Id", id);
                }
            , returnParameters: null
            );
        }

        private static Appointment MapSingleAppointment(IDataReader reader, ref int startingIndex)
        {
            Appointment appointment = new Appointment();

            appointment.Id = reader.GetSafeInt32(startingIndex++);
            appointment.MentorId = reader.GetSafeInt32(startingIndex++);
            appointment.MenteeId = reader.GetSafeInt32(startingIndex++);
            appointment.ApptDateTime = reader.GetSafeDateTime(startingIndex++);
            appointment.ApptTypeId = reader.GetSafeInt32(startingIndex++);
            appointment.ApptType = reader.GetSafeString(startingIndex++);
            appointment.Description = reader.GetSafeString(startingIndex++);
            appointment.AppointmentUrl = reader.GetSafeString(startingIndex++);
            appointment.ApptStatusId = reader.GetSafeInt32(startingIndex++);
            appointment.ApptStatus = reader.GetSafeString(startingIndex++);
            appointment.IsFirstMeeting = reader.GetSafeBool(startingIndex++);

            return appointment;
        }

        private static void AddCommonParams(AppointmentAddRequest model, SqlParameterCollection col)
        {
            col.AddWithValue("@ApptDateTime", model.ApptDateTime);
            col.AddWithValue("@AppointmentTypeId", model.ApptTypeId);
            col.AddWithValue("@Description", model.Description);
            col.AddWithValue("@AppointmentUrl", model.AppointmentUrl);
            col.AddWithValue("@AppointmentStatusId", model.ApptStatusId);
            col.AddWithValue("@IsFirstMeeting", model.IsFirstMeeting);
        }

        public List<UserRelation> GetRelation(int userId)
        {
            string procName = "[dbo].[AppointmentsRelations_Select_ByUserId]";

            List<UserRelation> list = null;

            _data.ExecuteCmd(procName
                , delegate (SqlParameterCollection collection)
                {
                    collection.AddWithValue("@UserId", userId);
                }
                 , delegate (IDataReader reader, short set)
                 {
                     UserRelation relation = new UserRelation();

                     int startingIndex = 0;

                     relation.MentorId = reader.GetSafeInt32(startingIndex++);
                     relation.MenteeId = reader.GetSafeInt32(startingIndex++);

                     if (list == null)
                     {
                         list = new List<UserRelation>();
                     }

                     list.Add(relation);
                 });
            return list;
        }

        public void CreateRelation(UserRelationAddRequest model, int userId)
        {


            string procName = "[dbo].[AppointmentsRelations_Insert]";

            _data.ExecuteNonQuery(procName
                , inputParamMapper: delegate (SqlParameterCollection col)
                {
                    col.AddWithValue("@MentorId", userId);
                    col.AddWithValue("@MenteeId", model.MenteeId);
                }
                 , returnParameters: null
                 );
        }

        public void DeleteRelation(int menteeId, int mentorId)
        {
            string procName = "[dbo].[AppointmentsRelations_Delete]";

            _data.ExecuteNonQuery(procName
                , inputParamMapper: delegate (SqlParameterCollection col)
                {
                    col.AddWithValue("@MentorId", mentorId);
                    col.AddWithValue("@MenteeId", menteeId);
                }
            , returnParameters: null
            );
        }

        public void DeleteRelationV2(int menteeId, int mentorId)
        {
            string procName = "[dbo].[AppointmentsRelations_DeleteV2]";

            _data.ExecuteNonQuery(procName
                , inputParamMapper: delegate (SqlParameterCollection col)
                {
                    col.AddWithValue("@MenteeId", menteeId);
                    col.AddWithValue("@MentorId", mentorId);
                }
            , returnParameters: null
            );
        }

        public Paged<MentorAppointments> GetMentorAppts(int pageIndex, int pageSize, int userId)
        {

            List<MentorAppointments> list = null;

            Paged<MentorAppointments> pagedObject = null;

            string proc = "[dbo].[Appointments_Select_ByUserId_V2]";

            int totalCount = 0;

            _data.ExecuteCmd(proc
                , inputParamMapper: delegate (SqlParameterCollection collection)
                {
                    collection.AddWithValue("@UserId", userId);
                    collection.AddWithValue("@PageIndex", pageIndex);
                    collection.AddWithValue("@PageSize", pageSize);
                }
            , singleRecordMapper: delegate (IDataReader reader, short set)
            {
                int startingIndex = 0;
                MentorAppointments appointments = MapMentorAppointments(reader, ref startingIndex);

                if (totalCount == 0)
                {
                    totalCount = reader.GetSafeInt32(startingIndex++);
                }

                if (list == null)
                {
                    list = new List<MentorAppointments>();
                }

                list.Add(appointments);

            });
            if (list != null)
            {

                pagedObject = new Paged<MentorAppointments>(list, pageIndex, pageSize, totalCount);
            }

            return pagedObject;
        }

        private static MentorAppointments MapMentorAppointments(IDataReader reader, ref int startingIndex)
        {
            MentorAppointments appointments = new MentorAppointments();

            appointments.Id = reader.GetSafeInt32(startingIndex++);
            appointments.MentorId = reader.GetSafeInt32(startingIndex++);
            appointments.MenteeId = reader.GetSafeInt32(startingIndex++);
            appointments.ApptDateTime = reader.GetSafeDateTime(startingIndex++);
            appointments.ApptTypeId = reader.GetSafeInt32(startingIndex++);
            appointments.ApptType = reader.GetSafeString(startingIndex++);
            appointments.Description = reader.GetSafeString(startingIndex++);
            appointments.AppointmentUrl = reader.GetSafeString(startingIndex++);
            appointments.ApptStatusId = reader.GetSafeInt32(startingIndex++);
            appointments.ApptStatus = reader.GetSafeString(startingIndex++);
            appointments.IsFirstMeeting = reader.GetSafeBool(startingIndex++);
            appointments.FirstName = reader.GetSafeString(startingIndex++);
            appointments.LastName = reader.GetSafeString(startingIndex++);
            appointments.AvatarUrl = reader.GetSafeString(startingIndex++);
            return appointments;
        }

     
    }
}
