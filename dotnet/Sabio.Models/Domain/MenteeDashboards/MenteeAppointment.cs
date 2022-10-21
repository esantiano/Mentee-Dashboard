using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Sabio.Models.Domain.Comment;

namespace Sabio.Models.Domain.MenteeDashboards
{
    public class MenteeAppointment
    {
        public int Id { get; set; }
        public LookUp AppointmentType { get; set; }
        public LookUp AppointmentStatus { get; set; }
        public DateTime ApptDateTime { get; set; }
        public string Description { get; set; }
        public string AppointmentUrl { get; set; }
        public int MentorUserId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string ImageUrl { get; set; }
        public List<Comment.Comment> AppointmentComments { get; set; }

    }
}
