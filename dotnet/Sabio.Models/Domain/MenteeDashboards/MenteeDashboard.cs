using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Sabio.Models.Domain.MenteeDashboards;
using Sabio.Models.Domain.Mentors;

namespace Sabio.Models.Domain.Mentees
{
    public class MenteeDashboard
    {
        public MenteeProfile Profile { get; set; }
        public List<MenteeAppointment> Appointments { get; set; }
        public List<MentorProfile> MatchedMentors { get; set; }

    }
}
