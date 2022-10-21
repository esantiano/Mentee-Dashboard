
using System.Collections.Generic;
using Sabio.Models.Domain.MenteeDashboards;
using Sabio.Models.Domain.Mentees;
using Sabio.Models.Requests.MenteeDash;

namespace Sabio.Services.Interfaces
{
    public interface IMenteeDashboardService
    {
        MenteeDashboard GetInformation(int userId);
        List<MentorMatch> GetMentorMatches(int id);
        List<MenteeAppointment> GetMenteeAppointments(int id);
        MenteeProfile GetMenteeProfile(int id);
        MenteeDonation GetDonations(int id);
        int AddAppointmentComment(AppointmentCommentAddRequest model, int userId);
    }
}
