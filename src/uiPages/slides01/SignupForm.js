import { Link, } from 'react-router-dom'
import { useState, useEffect,} from 'react'

function SignipForm(props) {

  const {
    activeClass,
    setSingupFormValue,
    setActive,
    signupForm,
    handleSignupChange,
    errorMessage,
    show,
    setShow,
    googleLoginUrl,
    setSignupForm,
    setErrorMessage,

  } = props
  const [cityList, setCityList] = useState([])
  const [allDistList, setAllDistList] = useState([])
  const [distList, setDistList] = useState([])

  const getAddressData = async () => {
  }

  const changeDist = (n) => {
    setDistList(
      allDistList.filter((v) => v.parent_sid == n).map((e) => e.ctname)
    )
  }

  useEffect(() => {
    getAddressData()
  }, [])

  return (
    <>
      {/* 申請第1步 */}
      <div
        className={activeClass(
          'form_area signup_form_out',
          'form_area',
          'form_area signup_form_out'
        )}
      >
        <div className="sign_form_title">Welcome</div>
        <div className="now_page login_mobile_hidden"
         onClick={(e)=>{
          e.preventDefault()
          setSignupForm({...signupForm,
            name:'比比編',
            password: '',
            mobile: '0982034566',
            gender: 'male',
            birthday: '1999-03-29',
            address_city: '臺北市',
            address_dist: '松山區',
            address_rd: '光復北路190巷2號',
          })
        }}>Sign up</div>
        <form name="sign_form" className="login_form">
          <div className="form_box">
            <label className="label"><i className="fa-2xs fa-solid fa-hashtag" style={{color:"coral"}}></i> 姓名 </label>
            <input
              type="text"
              placeholder="您的中文大名"
              name="name"
              className="form_input"
              value={signupForm.name}
              onChange={(e) => {
                setSingupFormValue(e)
                handleSignupChange(e,1)
              }}
            />
            <div className="login_input_alert_info input_alert_true">
            {errorMessage.name}
            </div>
          </div>
          <div className="form_box">
            <label className="label"><i className="fa-2xs fa-solid fa-hashtag" style={{color:"coral"}}></i> E-mail</label>
            <input
              type="text"
              placeholder="E-mail"
              name="email"
              className="form_input"
              value={signupForm.email}
              onChange={(e) => {
                setSingupFormValue(e)
                handleSignupChange(e,2)

              }}
            />
            <div className="login_input_alert_info input_alert_true">
            {errorMessage.email_s}
            </div>
          </div>
          <div className="form_box">
            <label className="label"><i className="fa-2xs fa-solid fa-hashtag" style={{color:"coral"}}></i> 密碼</label>
            <input
              type={show?'text':'password'}
              placeholder="Password"
              name="password"
              className="form_input"
              value={signupForm.password}
              onChange={(e) => {
                setSingupFormValue(e)
                handleSignupChange(e,3)

              }}
            />
            <div onMouseDown={()=>{
              setShow(true)
            }} onMouseUp={()=>{
              setShow(false)
            }} 
            className="changeEye">
              {show?<i  className="fa-solid fa-eye"></i>:<i className="fa-solid fa-eye-slash"></i>}
            </div>
            <div className="login_input_alert_info input_alert_true">
            {errorMessage.password}

            </div>
          </div>
          <div className="form_box">
            <label className="label">請再輸入一次密碼</label>
            <input
              type="password"
              placeholder=""
              name="password2"
              className="form_input"
              value={signupForm.password2}
              onChange={(e) => {
                setSingupFormValue(e)
                handleSignupChange(e,32)

              }}
            />
            <div className="login_input_alert_info input_alert_true">
            {errorMessage.password2}

            </div>
          </div>

          <div className="form_btn">
            <button
              className="loginPage_button sign_form_btn"
              onClick={(e) => {
                e.preventDefault()
                if(signupForm.password.length<1){
                  setErrorMessage({...errorMessage,password:'請設定含1個大寫字母、1個小寫字母貳位數字、長度6-12位的密碼'});
                }else{
                  if(!signupForm.password2){
                  setErrorMessage({...errorMessage,password2:'請再次確認您的密碼'});
                 } else{
                    if(signupForm.password!==signupForm.password2){
                    setErrorMessage({...errorMessage,password2:'兩次輸入密碼不同'});
                  }else{
                    setActive(3)
                  } }}
                }}
            >
              下一步
            </button>
          </div>

          <div className="form_btn">
            <button
              className="loginPage_button google_login_btn"
                         >
             <i className="fa-brands fa-google" style={{color: "#DB4437"}}></i> Google 登入
            </button>
            <Link className='d-none' to={googleLoginUrl}></Link>
          </div>
        </form>
      </div>

      {/* 申請第2步 */}
      <div
        className={activeClass(
          'form_area signup_form_out',
          'form_area signup_form_out',
          'form_area signup_step2'
        )}
      >
        <div className="sign_form_title login_mobile_hidden">Welcome</div>
        <form name="sign_form" className="login_form">
          <div className="form_box">
            <label htmlFor="mobile" className="label">
              電話
            </label>
            <input
              maxLength={10}
              type="text"
              placeholder="09-"
              name="mobile"
              className="form_input"
              value={signupForm.mobile}
              onChange={(e) => {
                setSingupFormValue(e)
                handleSignupChange(e,4)

              }}
            />
            <div className="login_input_alert_info input_alert_true">
            {errorMessage.phone}
            </div>
          </div>
          <div className="form_box">
            <label className="label">性別</label>
            <div className="genderBox">
              <label className="form_input" htmlFor="male">
                <input
                  type="radio"
                  name="gender"
                  id="male"
                  className=""
                  value="male"
                  checked={signupForm.gender === 'male'}
                  onChange={(e) => {
                    setSingupFormValue(e)
                  }}
                />
                <label htmlFor="male" className="genderRadio">
                  生理男
                </label>
              </label>
              <label className="form_input " htmlFor="female">
                <input
                  type="radio"
                  name="gender"
                  id="female"
                  className=""
                  value="female"
                  checked={signupForm.gender === 'female'}
                  onChange={(e) => {
                    setSingupFormValue(e)
                  }}
                />
                <label htmlFor="female" className="genderRadio">
                  生理女
                </label>
              </label>
            </div>
          </div>
          <div className="form_box">
            <label htmlFor="email" className="label">
              生日
            </label>
            <input
              type="date"
              name="birthday"
              value={signupForm.birthday}
              className="form_input"
              onChange={(e) => {
                setSingupFormValue(e)
              }}
            />
          </div>
          <div className="form_box">
            <div className="genderBox">
              <div className="">
                <label htmlFor="password" className="label">
                  居住縣市
                </label>
                <select
                  type="text"
                  placeholder="password"
                  name="address_city"
                  className="form_input"
                  value={signupForm.address_city}
                  onChange={(e) => {
                    changeDist(e.target.selectedIndex)
                    setSingupFormValue(e)
                  }}
                >
                  <option value="請選擇縣市" hidden disabled>
                    請選擇縣市
                  </option>
                  {cityList.map((v, i) => {
                    return (
                      <option key={i} value={v}>
                        {v}
                      </option>
                    )
                  })}
                </select>
              </div>
              <div className="">
                <label htmlFor="password" className="label">
                  鄉鎮區
                </label>
                <select
                  type="text"
                  placeholder="password"
                  name="address_dist"
                  className="form_input"
                  value={signupForm.address_dist}
                  onChange={(e) => {
                    setSingupFormValue(e)
                  }}
                >
                  <option value="請選擇鄉鎮區" hidden disabled>
                    請選擇鄉鎮區
                  </option>
                  {distList.map((v, i) => {
                    return (
                      <option key={i} value={v}>
                        {v}
                      </option>
                    )
                  })}
                </select>
              </div>
            </div>
          </div>
          <div className="form_box">
            <label htmlFor="password" className="label">
              居住詳細路址
            </label>
            <input
              type="text"
              placeholder="EX:大安路1號"
              name="address_rd"
              className="form_input"
              value={signupForm.address_rd}
              onChange={(e) => {
                setSingupFormValue(e)
              }}
            />
          </div>

          

          <div className="form_btn">
            <button
              onClick={(e) => {
                e.preventDefault()
                setActive(2)
              }}
              className="loginPage_button sign_form_btn forget_pass_btn"
            >
              上一步
            </button>
            <button
              className="loginPage_button sign_form_btn done"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M15.9355 8.02594V8.69236C15.9346 10.2544 15.4288 11.7743 14.4935 13.0254C13.5583 14.2765 12.2436 15.1917 10.7457 15.6346C9.24777 16.0775 7.64681 16.0243 6.18157 15.483C4.71634 14.9416 3.46534 13.9412 2.61516 12.6308C1.76498 11.3204 1.36117 9.77026 1.46394 8.21161C1.56672 6.65296 2.17058 5.16929 3.18547 3.98188C4.20035 2.79446 5.57189 1.96692 7.09551 1.62268C8.61914 1.27844 10.2132 1.43593 11.64 2.07168"
                  stroke="#233A66"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M15.9363 2.89746L8.69262 10.1483L6.51953 7.97525"
                  stroke="#233A66"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              完成申請
            </button>
          </div>
        </form>
      </div>
    </>
  )
}

export default SignipForm
