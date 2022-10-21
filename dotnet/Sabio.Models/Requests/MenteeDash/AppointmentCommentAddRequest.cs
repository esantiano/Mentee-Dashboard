using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Sabio.Models.Domain.Comment;

namespace Sabio.Models.Requests.MenteeDash
{
    public class AppointmentCommentAddRequest : CommentAddRequest
    {
        public int AppointmentId { get; set; }
    }
}
