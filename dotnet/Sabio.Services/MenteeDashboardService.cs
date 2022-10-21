using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Sabio.Data;
using Sabio.Data.Providers;
using Sabio.Models.Domain;
using Sabio.Models.Domain.Comment;
using Sabio.Models.Domain.MenteeDashboards;
using Sabio.Models.Domain.Mentees;
using Sabio.Models.Domain.Mentors;
using Sabio.Models.Requests.MenteeDash;
using Sabio.Services.Interfaces;

namespace Sabio.Services
{
    public class MenteeDashboardService : IMenteeDashboardService
    {
        IDataProvider _data = null;

        public MenteeDashboardService(IDataProvider data)
        {
            _data = data;
        }
        public MenteeDashboard GetInformation(int userId)
        {
            MenteeDashboard dashboard = new MenteeDashboard();
            List<MenteeAppointment> apptList = new List<MenteeAppointment>();
            List<MentorProfile> matchList = new List<MentorProfile>();
            MenteeProfile profile = new MenteeProfile();
            string procName = "[dbo].[MenteeInformation_SelectById]";

            _data.ExecuteCmd(procName, inputParamMapper: delegate (SqlParameterCollection paramCollection)
            {
                paramCollection.AddWithValue("@LoggedInMenteeId", userId);
            }, singleRecordMapper: delegate (IDataReader reader, short set)
            {
                if (set == 0)
                {
                    MenteeAppointment appt = new MenteeAppointment();
                    appt = MenteeAppointmentMapper(reader);

                    if(appt == null)
                    {
                        apptList = new List<MenteeAppointment>();
                    }
                    apptList.Add(appt);
                }
                else if(set == 1)
                {
                    MentorProfile match = new MentorProfile();
                    match = MentorInformationMapper(reader);

                    if(match == null)
                    {
                        matchList = new List<MentorProfile>();
                    }
                    matchList.Add(match);
                }
                else if(set == 2)
                {
                    profile = MenteeProfileInformationMapper(reader);
                }
            });
            dashboard.Appointments = apptList;
            dashboard.MatchedMentors = matchList;
            dashboard.Profile = profile;
            return dashboard;
        }
        public int AddAppointmentComment(AppointmentCommentAddRequest model, int userId)
        {
            int id = 0;
            string procName = "[dbo].[MenteeAppointmentComment_Insert]";

            _data.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection col)
            {
                AddCommonParams(model, col);
                col.AddWithValue("@createdBy", userId);
                col.AddWithValue("@AppointmentId", model.AppointmentId);

                SqlParameter idOut = new SqlParameter("@Id", SqlDbType.Int);
                idOut.Direction = ParameterDirection.Output;
                col.Add(idOut);
            },
            returnParameters: delegate (SqlParameterCollection returnCollection)
            {
                object oId = returnCollection["@Id"].Value;

                int.TryParse(oId.ToString(), out id);
            });
            return id;
        }
        public MenteeDonation GetDonations (int id)
        {
            MenteeDonation sumDonationAmount = null;
            string procName = "[dbo].[DonationsSum_SelectById]";

            _data.ExecuteCmd(procName, delegate (SqlParameterCollection paramCollection)
            {
                paramCollection.AddWithValue("@UserId", id);
            }, delegate (IDataReader reader, short set)
            {
                sumDonationAmount = new MenteeDonation();
                int index = 0;
                Console.WriteLine(reader.GetSafeDouble(index));
                sumDonationAmount.SummedAmount = reader.GetSafeDouble(index++);
            });
            return sumDonationAmount;
        }
        public List<MentorMatch> GetMentorMatches(int id)
        {
            MentorMatch match = null;
            List<MentorMatch> matches = null;
            string procName = "[dbo].[MenteeMentorMatches_SelectById]";

            _data.ExecuteCmd(procName, delegate (SqlParameterCollection paramCollection)
            {
                paramCollection.AddWithValue("@LoggedInMenteeId", id);
            }, delegate (IDataReader reader, short set)
            {
                match = MentorInformationMapper(reader);
                if (matches == null)
                {
                    matches = new List<MentorMatch>();
                }
                matches.Add(match);
            });
            return matches;
        }
        public List<MenteeAppointment> GetMenteeAppointments(int id)
        {
            MenteeAppointment appointment = null;
            List<MenteeAppointment> appointments = null;
            string procName = "[dbo].[MenteeAppointments_Select]";

            _data.ExecuteCmd(procName, delegate (SqlParameterCollection paramCollection)
            {
                paramCollection.AddWithValue("@LoggedInMenteeId", id);
            }, delegate (IDataReader reader, short set)
            {
                
                appointment = MenteeAppointmentMapper(reader);
                if(appointments == null)
                {
                    appointments = new List<MenteeAppointment>();
                }
                appointments.Add(appointment);
            });
            return appointments;
        }
        public MenteeProfile GetMenteeProfile(int id)
        {
            MenteeProfile profile = null;
            string procName = "[dbo].[MenteeProfile_SelectById]";

            _data.ExecuteCmd(procName, delegate (SqlParameterCollection paramCollection)
            {
                paramCollection.AddWithValue("@LoggedInMenteeId", id);
            }, delegate (IDataReader reader, short set)
            {
                profile = MenteeProfileInformationMapper(reader);
            });
            return profile;
        }
        private static MentorMatch MentorInformationMapper(IDataReader reader)
        {
            MentorMatch profile = new MentorMatch();
            int index = 0;
            profile.Id = reader.GetSafeInt32(index++);
            profile.UserId = reader.GetSafeInt32(index++);
            profile.FirstName = reader.GetSafeString(index++);
            profile.LastName = reader.GetSafeString(index++);
            profile.ImageUrl = reader.GetSafeString(index++);
            profile.Description = reader.GetSafeString(index++);
            profile.PhoneNumber = reader.GetSafeString(index++);
            profile.SocialMediaLink = reader.GetSafeString(index++);
            profile.FocusAreas = reader.DeserializeObject<List<FocusArea>>(index++);
            profile.Ages = reader.DeserializeObject<List<Age>>(index++);
            profile.Grades = reader.DeserializeObject<List<Grade>>(index++);
            profile.MentoringTypes = reader.DeserializeObject<List<MentoringType>>(index++);
            profile.GenderTypes = reader.DeserializeObject<List<GenderType>>(index++);
            profile.Specialties = reader.DeserializeObject<List<Specialty>>(index++);
            return profile;
        }
        private static MenteeAppointment MenteeAppointmentMapper(IDataReader reader)
        {
            int index = 0;
            MenteeAppointment appointment = new MenteeAppointment();
            appointment.Id = reader.GetSafeInt32(index++);
            appointment.AppointmentType = new LookUp()
            {
                Id = reader.GetSafeInt32(index++),
                Name = reader.GetSafeString(index++)
            };
            appointment.AppointmentStatus = new LookUp()
            {
                Id = reader.GetSafeInt32(index++),
                Name = reader.GetSafeString(index++)
            };  
            appointment.ApptDateTime = reader.GetSafeDateTime(index++);
            appointment.Description = reader.GetSafeString(index++);
            appointment.AppointmentUrl = reader.GetSafeString(index++);
            appointment.MentorUserId = reader.GetSafeInt32(index++);
            appointment.FirstName = reader.GetSafeString(index++);
            appointment.LastName = reader.GetSafeString(index++);
            appointment.ImageUrl = reader.GetSafeString(index++);

            string AppointmentComments = reader.GetSafeString(index++);

            if(!string.IsNullOrEmpty(AppointmentComments))
            {
                appointment.AppointmentComments = Newtonsoft.Json.JsonConvert.DeserializeObject<List<Comment>>(AppointmentComments);
            }
            return appointment;
        }
        private static MenteeProfile MenteeProfileInformationMapper(IDataReader reader)
        {
            int index = 0;
            MenteeProfile profile = new MenteeProfile();
            profile.Id = reader.GetSafeInt32(index++);
            profile.UserId = reader.GetSafeInt32(index++);
            profile.FirstName = reader.GetSafeString(index++);
            profile.MiddleInitial = reader.GetSafeString(index++);
            profile.LastName = reader.GetSafeString(index++);
            profile.AvatarUrl = reader.GetSafeString(index++);
            profile.Email = reader.GetSafeString(index++);

            return profile;
        }
        private static void AddCommonParams(AppointmentCommentAddRequest model, SqlParameterCollection col)
        {
            col.AddWithValue("@Subject", model.Subject);
            col.AddWithValue("@Text", model.Text);
            col.AddWithValue("@ParentId", model.ParentId);
            col.AddWithValue("@EntityTypeId", model.EntityTypeId);
            col.AddWithValue("@EntityId", model.EntityId);
            col.AddWithValue("@IsDeleted", model.IsDeleted);
        }
    }
}
