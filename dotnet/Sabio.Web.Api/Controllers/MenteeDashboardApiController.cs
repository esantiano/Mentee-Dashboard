using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Sabio.Models.Domain.MenteeDashboards;
using Sabio.Models.Domain.Mentees;
using Sabio.Models.Requests.MenteeDash;
using Sabio.Services;
using Sabio.Services.Interfaces;
using Sabio.Web.Controllers;
using Sabio.Web.Models.Responses;

namespace Sabio.Web.Api.Controllers
{
    [Route("api/mentee/dashboard")]
    [ApiController]
    public class MenteeDashboardApiController : BaseApiController
    {
        private IMenteeDashboardService _menteeDashboardService;
        private IAuthenticationService<int> _authService = null;

        public MenteeDashboardApiController(IMenteeDashboardService menteeDashboardService
            , ILogger<MenteeDashboardApiController> logger
            , IAuthenticationService<int> authService) : base(logger)
        {
            _menteeDashboardService = menteeDashboardService;
            _authService = authService;
        }

        [HttpPost]
        public ActionResult<ItemResponse<int>> Add(AppointmentCommentAddRequest model)
        {
            int iCode = 200;
            ObjectResult result = null;

            try
            {
                int userId = _authService.GetCurrentUserId();
                int id = _menteeDashboardService.AddAppointmentComment(model, userId);

                ItemResponse<int> response = new ItemResponse<int> { Item = id };

                result = Created201(response);
            }
            catch (Exception ex)
            {
                base.Logger.LogError(ex.ToString());
                ErrorResponse response = new ErrorResponse(ex.Message);

                iCode = 500;
                result = StatusCode(500, response);
            }

            return StatusCode(iCode, result);

        }
        [HttpGet("profile/{id:int}")]
        public ActionResult<ItemsResponse<MenteeDashboard>> GetInformation(int id)
        {

            int iCode = 200;
            BaseResponse response = null;

            try
            {
                MenteeDashboard dashboard = _menteeDashboardService.GetInformation(id);

                if (dashboard == null)
                {
                    iCode = 404;
                    response = new ErrorResponse("Dashboard information not found.");
                }
                else
                {
                    response = new ItemResponse<MenteeDashboard> { Item = dashboard };
                }
            }

            catch (Exception ex)
            {
                iCode = 500;
                base.Logger.LogError(ex.ToString());
                response = new ErrorResponse($"Generic Errors: {ex.Message}");
            }
            return StatusCode(iCode, response);
        }


            [HttpGet("donations/{id:int}")]
        public ActionResult<ItemsResponse<MenteeDonation>> GetDonations(int id)
        {

            int iCode = 200;
            BaseResponse response = null;

            try
            {
                MenteeDonation sumOfDonations = _menteeDashboardService.GetDonations(id);

                if (sumOfDonations == null)
                {
                    iCode = 404;
                    response = new ErrorResponse("Donations information not found.");
                }
                else
                {
                    response = new ItemResponse<MenteeDonation> { Item = sumOfDonations };
                }
            }

            catch (Exception ex)
            {
                iCode = 500;
                base.Logger.LogError(ex.ToString());
                response = new ErrorResponse($"Generic Errors: {ex.Message}");
            }

            return StatusCode(iCode, response);
        }


        [HttpGet("matches/{id:int}")]
        public ActionResult<ItemsResponse<MentorMatch>> GetMentorMatches(int id)
        {

            int iCode = 200;
            BaseResponse response = null;

            try
            {
                List<MentorMatch> mentors = _menteeDashboardService.GetMentorMatches(id);

                if (mentors == null)
                {
                    iCode = 404;
                    response = new ErrorResponse("Mentor matches information not found.");
                }
                else
                {
                    response = new ItemsResponse<MentorMatch> { Items = mentors };
                }
            }

            catch (Exception ex)
            {
                iCode = 500;
                base.Logger.LogError(ex.ToString());
                response = new ErrorResponse($"Generic Errors: {ex.Message}");
            }

            return StatusCode(iCode, response);
        }

        [HttpGet("appointments/{id:int}")]
        public ActionResult<ItemsResponse<MenteeAppointment>> GetMenteeAppointments(int id)
        {

            int iCode = 200;
            BaseResponse response = null;

            try
            {
                List<MenteeAppointment> appointments = _menteeDashboardService.GetMenteeAppointments(id);

                if (appointments == null)
                {
                    iCode = 404;
                    response = new ErrorResponse("Appointments information not found.");
                }
                else
                {
                    response = new ItemsResponse<MenteeAppointment> { Items = appointments };
                }
            }

            catch (Exception ex)
            {
                iCode = 500;
                base.Logger.LogError(ex.ToString());
                response = new ErrorResponse($"Generic Errors: {ex.Message}");
            }
            return StatusCode(iCode, response);
        }

        [HttpGet("{id:int}")]
        public ActionResult<ItemResponse<MenteeProfile>> GetMenteeProfile(int id)
        {

            int iCode = 200;
            BaseResponse response = null;

            try
            {
                MenteeProfile profile = _menteeDashboardService.GetMenteeProfile(id);

                if (profile == null)
                {
                    iCode = 404;
                    response = new ErrorResponse("Profile information not found.");
                }
                else
                {
                    response = new ItemResponse<MenteeProfile> { Item = profile };
                }
            }

            catch (Exception ex)
            {
                iCode = 500;
                base.Logger.LogError(ex.ToString());
                response = new ErrorResponse($"Generic Errors: {ex.Message}");
            }
            return StatusCode(iCode, response);
        }
    }
}
