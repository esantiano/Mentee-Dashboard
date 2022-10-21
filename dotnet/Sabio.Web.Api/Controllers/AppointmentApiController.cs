using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Sabio.Models;
using Sabio.Models.Domain.Appointment;
using Sabio.Models.Requests.Appointments;
using Sabio.Services;
using Sabio.Web.Controllers;
using Sabio.Web.Models.Responses;
using System;
using System.Collections.Generic;

namespace Sabio.Web.Api.Controllers
{
    [Route("api/appointments")]
    [ApiController]
    public class AppointmentApiController : BaseApiController
    {

        private IAppointmentService _appointmentService = null;
        private IAuthenticationService<int> _authService = null;

        public AppointmentApiController(IAppointmentService appointmentService
            , ILogger<LocationApiController> logger
            , IAuthenticationService<int> authenticationService) : base(logger)
        {
            _appointmentService = appointmentService;
            _authService = authenticationService;
        }
        [HttpPut("cancel/{id:int}")]
        public ActionResult<SuccessResponse> CancelAppointment(int id)
        {
            int iCode = 200;
            BaseResponse response = null;
            try
            {
                _appointmentService.CancelAppointment(id);

                response = new SuccessResponse();
            }
            catch (Exception ex) 
            {
                iCode = 500;
                response = new ErrorResponse(ex.Message);
            }
            return StatusCode(iCode, response);
        }

        [HttpGet]
        public ActionResult<ItemResponse<Paged<Appointment>>> GetAppts(int pageIndex, int pageSize)
        {
            int iCode = 200;
            BaseResponse response = null;
            try
            {
                int userId = _authService.GetCurrentUserId();
                Paged<Appointment> paginated = _appointmentService.GetAppts(pageIndex, pageSize, userId);

                if (paginated == null)
                {
                    iCode = 404;
                    response = new ErrorResponse("App Resource not found");
                }
                else
                {
                    response = new ItemResponse<Paged<Appointment>> { Item = paginated };
                }

            }
            catch (Exception ex)
            {
                iCode = 500;
                response = new ErrorResponse(ex.Message);
                base.Logger.LogError(ex.ToString());
            }
            return StatusCode(iCode, response);
        }

        [HttpGet("apptsbydate")]
        public ActionResult<ItemResponse<Paged<Appointment>>> GetApptsByDate(int pageIndex, int pageSize, DateTime startDate, DateTime endDate)
        {
            int iCode = 200;
            BaseResponse response = null;
            try
            {
                Paged<Appointment> paginated = _appointmentService.GetApptsByDate(pageIndex, pageSize, startDate, endDate);

                if (paginated == null)
                {
                    iCode = 404;
                    response = new ErrorResponse("App Resource not found");
                }
                else
                {
                    response = new ItemResponse<Paged<Appointment>> { Item = paginated };
                }

            }
            catch (Exception ex)
            {
                iCode = 500;
                response = new ErrorResponse(ex.Message);
                base.Logger.LogError(ex.ToString());
            }
            return StatusCode(iCode, response);
        }

        [HttpGet("mentorAllAppts")]
        public ActionResult<ItemsResponse<MentorAppointments>> GetAllMentorAppts()
        {
            int iCode = 200;
            BaseResponse response = null;
            try
            {
                int userId = _authService.GetCurrentUserId();
                List<MentorAppointments> list = _appointmentService.GetAllMentorAppts(userId);

                if (list == null)
                {
                    iCode = 404;
                    response = new ErrorResponse("App Resource not found");
                }
                else
                {
                    response = new ItemsResponse<MentorAppointments> { Items = list };
                }

            }
            catch (Exception ex)
            {
                iCode = 500;
                response = new ErrorResponse(ex.Message);
                base.Logger.LogError(ex.ToString());
            }
            return StatusCode(iCode, response);
        }

        [HttpPost("mentor")]
        public ActionResult<ItemResponse<int>> MentorCreate(AppointmentAddRequest model)
        {
            ObjectResult result = null;

            try
            {

                int userId = _authService.GetCurrentUserId();
                int id = _appointmentService.MentorCreate(model, userId);
                ItemResponse<int> response = new ItemResponse<int> { Item = id };
                result = Created201(response);
            }
            catch (Exception ex)
            {
                base.Logger.LogError(ex.ToString());

                ErrorResponse response = new ErrorResponse(ex.Message);
                result = StatusCode(500, response);
            }
            return result;
        }
        
        [HttpPost("mentee")]
        public ActionResult<ItemResponse<int>> MenteeCreate(AppointmentAddRequest model)
        {
            ObjectResult result = null;

            try
            {

                int userId = _authService.GetCurrentUserId();
                int id = _appointmentService.MenteeCreate(model, userId);
                ItemResponse<int> response = new ItemResponse<int> { Item = id };
                result = Created201(response);
            }
            catch (Exception ex)
            {
                base.Logger.LogError(ex.ToString());

                ErrorResponse response = new ErrorResponse(ex.Message);
                result = StatusCode(500, response);
            }
            return result;
        }

        [HttpPut("{id:int}")]
        public ActionResult<SuccessResponse> Update(AppointmentUpdateRequest model)
        {
            int iCode = 200;
            BaseResponse response = null;

            try
            {
                int userId = _authService.GetCurrentUserId();
                _appointmentService.Update(model);
                response = new SuccessResponse();

            }
            catch (Exception ex)
            {
                base.Logger.LogError(ex.ToString());
                iCode = 500;
                response = new ErrorResponse(ex.Message);

            }
            return StatusCode(iCode, response);
        }

        [HttpDelete("delete")]
        public ActionResult<SuccessResponse> Delete(int apptId, int mentorId)
        {
            int iCode = 200;
            BaseResponse response = null;

            try
            {
                int currentUserId = _authService.GetCurrentUserId();
                if(mentorId == currentUserId)
                {
                    _appointmentService.Delete(apptId);
                    response = new SuccessResponse();
                } else
                {
                    iCode = 403;
                    response = new ErrorResponse("Unauthorized request.");
                }
               
          
            }
            catch (Exception ex)
            {
                iCode = 500;
                response = new ErrorResponse(ex.Message);
                base.Logger.LogError(ex.ToString());
            }
            return StatusCode(iCode, response);
        }

        [HttpGet("permissions")]
        public ActionResult<ItemsResponse<UserRelation>> Get()
        {
            int iCode = 200;
            BaseResponse response = null;

            try
            {
                int userId = _authService.GetCurrentUserId();
                List<UserRelation> location = _appointmentService.GetRelation(userId);
                if (location == null)
                {
                    iCode = 404;
                    response = new ErrorResponse("Record Not Found");
                }
                else
                {
                    response = new ItemsResponse<UserRelation> { Items = location };
                }
            }
            catch (Exception ex)
            {
                iCode = 500;
                response = new ErrorResponse(ex.Message);
                Logger.LogError(ex.ToString());
            }

            return StatusCode(iCode, response);
        }

        [HttpPost("permissions")]
        public ActionResult<ItemResponse<string>> CreateRelation(UserRelationAddRequest model)
        {
            ObjectResult result = null;

            try
            {

                int userId = _authService.GetCurrentUserId();
                _appointmentService.CreateRelation(model, userId);
                ItemResponse<string> response = new ItemResponse<string> { Item = $"Mentee ID:{model.MenteeId} can now make appoitments with ID:{userId}" };
                result = Created201(response);
            }
            catch (Exception ex)
            {
                base.Logger.LogError(ex.ToString());

                ErrorResponse response = new ErrorResponse(ex.Message);
                result = StatusCode(500, response);
            }
            return result;
        }

        [HttpDelete("permissions/{menteeId:int}")]
        public ActionResult<SuccessResponse> DeleteRelation(int menteeId)
        {
            int iCode = 200;
            BaseResponse response = null;

            try
            {
                int mentorId = _authService.GetCurrentUserId();
                _appointmentService.DeleteRelation(menteeId, mentorId);
                response = new SuccessResponse();
            }
            catch (Exception ex)
            {
                iCode = 500;
                response = new ErrorResponse(ex.Message);
                base.Logger.LogError(ex.ToString());
            }
            return StatusCode(iCode, response);
        }

        [HttpDelete("permissionsV2/{mentorId:int}")]
        public ActionResult<SuccessResponse> DeleteRelationV2(int mentorId)
        {
            int iCode = 200;
            BaseResponse response = null;

            try
            {
                int menteeId = _authService.GetCurrentUserId();
                _appointmentService.DeleteRelationV2(menteeId, mentorId);
                response = new SuccessResponse();
            }
            catch (Exception ex)
            {
                iCode = 500;
                response = new ErrorResponse(ex.Message);
                base.Logger.LogError(ex.ToString());
            }
            return StatusCode(iCode, response);
        }

        [HttpGet("mentorAppts")]
        public ActionResult<ItemResponse<Paged<MentorAppointments>>> GetMentorAppts(int pageIndex, int pageSize)
        {
            int iCode = 200;
            BaseResponse response = null;
            try
            {
                int userId = _authService.GetCurrentUserId();
                Paged<MentorAppointments> paginated = _appointmentService.GetMentorAppts(pageIndex, pageSize, userId);

                if (paginated == null)
                {
                    iCode = 404;
                    response = new ErrorResponse("App Resource not found");
                }
                else
                {
                    response = new ItemResponse<Paged<MentorAppointments>> { Item = paginated };
                }

            }
            catch (Exception ex)
            {
                iCode = 500;
                response = new ErrorResponse(ex.Message);
                base.Logger.LogError(ex.ToString());
            }
            return StatusCode(iCode, response);
        }
    }
}
