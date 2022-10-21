using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Sabio.Models.Domain.Mentors;

namespace Sabio.Models.Domain.MenteeDashboards
{
    public class MentorMatch : MentorProfile
    {
        public List<MenteeProfile> Mentees { get; set; }
    }
}
