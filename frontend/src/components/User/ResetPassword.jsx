import React, { Fragment, useEffect, useState } from 'react'
import { useAlert } from 'react-alert'
import {useSelector, useDispatch} from "react-redux"
import { useNavigate, useParams } from 'react-router-dom'
import { clearUserError, clearUserMessage, resetPassword } from '../../features/userSlice'
import Loader from '../Loader/Loader'
import { MdPassword } from "react-icons/md"
import { RiLockPasswordFill } from "react-icons/ri"
import "./Signin.css"

const ResetPassword = () => {
  const {loading, message, error } = useSelector(state => state.user)
  const dispatch = useDispatch()
  const alert = useAlert()
  const navigate = useNavigate()

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const { token } = useParams()
  
  const submitHandler = (e) => {
    e.preventDefault()
    const myForm = new FormData()
    myForm.set("password", password)
    myForm.set("confirmPassword", confirmPassword)
    const userData = { "token": token, myForm }
    dispatch(resetPassword(userData))
  }

  useEffect(() => {
    if (error) {
      alert.error(error)
      dispatch(clearUserError())
    }
    if (message) {
      alert.success(message)
      dispatch(clearUserMessage())
      navigate("/signin")
    }
  }, [error, message, dispatch, alert, navigate])

  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <div className="login__container">
          <form onSubmit={submitHandler}>
            <div>
              <MdPassword />
              <input
                type="password"
                required
                placeholder="Password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div>
              <RiLockPasswordFill />
              <input
                type="password"
                required
                placeholder="Confirm Password"
                name="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <input type="submit" value="Change Password" className="btn" />
          </form>
        </div>
      )}
    </Fragment>
  );
}

export default ResetPassword