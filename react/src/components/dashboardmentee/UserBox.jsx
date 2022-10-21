
import React from "react"
import { Card } from "react-bootstrap"
import { Link, useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faGoogle, faTwitter, faGithub } from '@fortawesome/free-brands-svg-icons';
import {UserBoxProp} from "./menteeDashboardPropTypes"

const UserBox = (user) => {
const navigate = useNavigate();
const goToEdit = (e) => {
  e.preventDefault();
  navigate(e.currentTarget.dataset.page)
}
  return (
    <Card className="text-center">
      <Card.Body key={user.props.id}
      useridkey={user.props.userId}>
      <img src={user.props.avatarUrl}
        alt="" 
        className="rounded-circle avatar-lg img-thumbnail"
                    />
        <h4 className="mb-0 mt-2">{user.props.firstName} {user.props.lastName}</h4>
        <p className="text-muted font-14"></p>
        <button type="button" className="btn btn-danger btn-sm mb-2" onClick={goToEdit} data-page='/dashboard/profiles/edit'>
          Edit Profile
        </button>
        <div className="text-start mt-3">
          <h4 className="font-13 text-uppercase">About Me :</h4>
          <p className="text-muted font-13 mb-3">Hello Im new to the Institute to Advance Diversity.
          </p>
          <p className="text-muted mb-2 font-13">
            <strong>Full Name</strong>
            <span className="ms-2">{user.props.firstName} {user.props.middleInitial} {user.props.lastName}</span>
          </p>

          <p className="text-muted mb-2 font-13">
            <strong>Mobile :</strong>
            <span className="ms-2"></span>
          </p>

          <p className="text-muted mb-2 font-13">
            <strong>Email :</strong>
            <span className="ms-2 ">{user.props.email}</span>
          </p>

          <p className="text-muted mb-1 font-13">
            <strong>Location :</strong>
            <span className="ms-2"></span>
          </p>
        </div>
        <ul className="social-list list-inline mt-3 mb-0">
            <li className="list-inline-item">
                <Link to="#" className="social-list-item border-primary text-primary">
                    <FontAwesomeIcon icon={faFacebook} />
                </Link>
            </li>
            <li className="list-inline-item">
                <Link to="#" className="social-list-item border-danger text-danger">
                    <FontAwesomeIcon icon={faGoogle} />
                </Link>
            </li>
            <li className="list-inline-item">
                <Link to="#" className="social-list-item border-info text-info">
                    <FontAwesomeIcon icon={faTwitter} />
                </Link>
            </li>
            <li className="list-inline-item">
                <Link to="#" className="social-list-item border-secondary text-secondary">
                    <FontAwesomeIcon icon={faGithub} />
                </Link>
            </li>
        </ul>
      </Card.Body>
    </Card>
  )
}
UserBox.propTypes = UserBoxProp 
export default UserBox
