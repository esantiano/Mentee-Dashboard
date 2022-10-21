using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Models.Domain.MenteeDashboards
{
    public class AppointmentComment
    {
        public int Id { get; set; }
        public string Subject { get; set; }
        public string Text { get; set;}
    }
}
