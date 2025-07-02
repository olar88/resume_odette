import { useState, useEffect } from "react";
import SignipForm from "./SignupForm";
import LoginForm from "./LoginForm";
import { useLocation, useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import "./../../css/login.css";

function MemberLogin() {
  const navigation = useNavigate();
  const [isActive, setActive] = useState(1);
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });
  const [signupForm, setSignupForm] = useState({
    name: "",
    email: "",
    password: "",
    password2: "",
    mobile: "",
    gender: "",
    birthday: "1990-01-01",
    address_city: "請選擇縣市",
    address_dist: "請選擇鄉鎮區",
    address_rd: "",
    memberPic: null,
  });
  const [infoState, setInfoState] = useState(1);

  const { state } = useLocation();

  const paramsChange = () => {
    if (state && state.email) {
      setActive(state.isActive);
      setSignupForm({
        ...signupForm,
        name: state.name,
        email: state.email,
        memberPic: state.member_pic,
      });
      setErrorMessage({ email_s: state.text });
    }
    if (state && state.text2) {
      setErrorMessage({ email_l: state.text2 });
    }
  };

  function slice() {
    isActive === 1 ? setActive(2) : setActive(1);
  }

  function setLoginFormValue(e) {
    setLoginForm({ ...loginForm, [e.target.name]: e.target.value });
  }
  function setSingupFormValue(e) {
    setSignupForm({ ...signupForm, [e.target.name]: e.target.value });
  }

  function activeClass(a, b, c) {
    switch (isActive) {
      // 登入畫面
      case 1:
        return a;

      //申請畫面一
      case 2:
        return b;

      //申請畫面二
      case 3:
        return c;

      default:
        return a;
    }
  }

  function infoClass(a, b, c) {
    switch (infoState) {
      // 未叫出
      case 1:
        return a;

      //成功
      case 2:
        return b;

      //失敗
      case 3:
        return c;

      default:
        return a;
    }
  }
  // 認證訊息
  const [errorMessage, setErrorMessage] = useState({
    email_l: "",
    password_l: "",
    name: "",
    email_s: "",
    password: "",
    password2: "",
    phone: "",
    isOkL: true,
    isOkS: false,
  });

  // Email認證
  function isValidEmail(email) {
    return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zAZ]{2,}))$/.test(
      email
    );
  }
  // 密碼驗證 密碼規則:最少6最多16含一大寫一小寫兩數字沒空白
  function isValisPass(pass) {
    return /^(?=.*\d{2,})(?=.*[a-z])(?=.*[A-Z]).{6,12}$/.test(pass);
  }
  // 電話驗證
  function isValidPhone(phone) {
    return /^09\d{2}-?\d{3}-?\d{3}$/.test(phone);
  }
  //登入驗證
  const handleLoginChange = (event, type) => {
    if (type == 1) {
      if (event.target.value.length < 1) {
        setErrorMessage({ ...errorMessage, email_l: "", isOkL: false });
        return;
      } else {
        if (!isValidEmail(event.target.value)) {
          setErrorMessage({
            ...errorMessage,
            email_l: "請輸入正確Email格式",
            isOkL: false,
          });
        } else {
          setErrorMessage({ ...errorMessage, email_l: "", isOkL: true });
        }
      }
    }
    // 密碼不得為空
    if (type == 2) {
      if (event.target.value.length < 1) {
        setErrorMessage({
          ...errorMessage,
          password_l: "請輸入密碼",
          isOkL: false,
        });
      } else {
        setErrorMessage({ ...errorMessage, password_l: "", isOkL: true });
      }
    }
  };

  //申請驗證
  const handleSignupChange = (event, type) => {
    //姓名
    if (type == 1) {
      if (event.target.value.length < 1) {
        setErrorMessage({ ...errorMessage, name: "", isOkS: false });
      } else {
        if (event.target.value.length > 0 && event.target.value.length < 2) {
          setErrorMessage({
            ...errorMessage,
            name: "請輸入正確姓名",
            isOkS: false,
          });
        } else {
          setErrorMessage({ ...errorMessage, name: "", isOkS: true });
        }
      }
    }
    // Email
    if (type == 2) {
      if (event.target.value.length < 1) {
        setErrorMessage({ ...errorMessage, email_s: "", isOkS: false });
        return;
      } else {
        if (!isValidEmail(event.target.value)) {
          setErrorMessage({
            ...errorMessage,
            email_s: "請輸入正確Email格式",
            isOkS: false,
          });
        } else {
          setErrorMessage({ ...errorMessage, email_s: "", isOkS: true });
        }
      }
    }
    // password
    if (type == 3) {
      if (event.target.value.length < 1) {
        setErrorMessage({ ...errorMessage, password: "", isOkS: false });
        return;
      } else {
        if (!isValisPass(event.target.value)) {
          setErrorMessage({
            ...errorMessage,
            password:
              "請設定含1個大寫字母、1個小寫字母貳位數字、長度6-12位的密碼",
            isOkS: false,
          });
        } else {
          setErrorMessage({ ...errorMessage, password: "", isOkS: true });
        }
      }
    }
    // password2
    if (type == 32) {
      if (event.target.value.length < 1) {
        setErrorMessage({ ...errorMessage, password2: "", isOkS: false });
        return;
      } else {
        if (event.target.value != signupForm.password) {
          setErrorMessage({
            ...errorMessage,
            password2: "兩次輸入密碼不同",
            isOkS: false,
          });
        } else {
          setErrorMessage({ ...errorMessage, password2: "", isOkS: true });
        }
      }
    }

    // password2
    if (type == 4) {
      if (event.target.value.length < 1) {
        setErrorMessage({ ...errorMessage, phone: "" });
        return;
      } else {
        if (!isValidPhone(event.target.value)) {
          setErrorMessage({
            ...errorMessage,
            phone: "請輸入正確號碼",
            isOkS: false,
          });
        } else {
          setErrorMessage({ ...errorMessage, phone: "", isOkS: true });
        }
      }
    }
  };

  // 密碼顯示狀態

  const [show, setShow] = useState(false);

  // 引入google登入的URL
  const [googleLoginUrl, setGoogleLoginUrl] = useState("");
  const getGoogleUrl = async () => {};

  //modal style
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 250,
    bgcolor: "#222222de",
    color: "#fff",
    // border: '2px solid #000',
    boxShadow: 24,
    pt: 2,
    px: 4,
    pb: 3,
    borderRadius: "3px",
    textAlign: "center",
  };

  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    getGoogleUrl();
    paramsChange();
  }, []);

  return (
    <div className="wrapper">
    
      <div
        className={activeClass(
          "ellipse_main",
          "ellipse_main ellipse_main2 ",
          "ellipse_main ellipse_main3 "
        )}
      ></div>
      <div
        className={activeClass(
          "ellipse_light",
          "ellipse_light ellipse_light2",
          "ellipse_light ellipse_light3"
        )}
      ></div>     

      <div className="login_box">
        <button
          className={activeClass(
            "loginPage_main_button loginPage_button login_mobile_hidden",
            "sing_up loginPage_main_button loginPage_button login_mobile_hidden",
            "d-none"
          )}
          onClick={() => {
            slice();
          }}
        >
          {activeClass("Sign Up", "Login", "")}
          <svg
            width="30"
            height="30"
            viewBox="0 0 37 36"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="18.5" cy="18" r="17.5" stroke="#F4F4F4" />
            <path
              d="M15.5 24L21.5 18L15.5 12"
              stroke="#F4F4F4"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <div
          className={activeClass(
            "login_display_area",
            "login_display_area singup_dispaly_area",
            "login_display_area  singup_step2_area"
          )}
        >
          <div className="mobile_switch_btn login_pc_hidden">
            <button
              className={activeClass("", "active", "active")}
              onClick={(e) => {
                setActive(2);
              }}
            >
              Sing Up
            </button>
            <button
              className={activeClass("active", "", "")}
              onClick={(e) => {
                setActive(1);
              }}
            >
              Login
            </button>
          </div>

          {/* 登入 */}
          <LoginForm
            loginForm={loginForm}
            setLoginFormValue={setLoginFormValue}
            activeClass={activeClass}
            setInfoState={setInfoState}
            errorMessage={errorMessage}
            handleLoginChange={handleLoginChange}
            show={show}
            setShow={setShow}
            googleLoginUrl={googleLoginUrl}
            setLoginForm={setLoginForm}
            handleOpen={handleOpen}
          />

          {/* 申請 */}
          <SignipForm
            setSingupFormValue={setSingupFormValue}
            activeClass={activeClass}
            setActive={setActive}
            signupForm={signupForm}
            setInfoState={setInfoState}
            errorMessage={errorMessage}
            handleSignupChange={handleSignupChange}
            show={show}
            setShow={setShow}
            googleLoginUrl={googleLoginUrl}
            setSignupForm={setSignupForm}
            setErrorMessage={setErrorMessage}
            handleOpen={handleOpen}
          />
        </div>
      </div>

      {/* 彈跳視窗 */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="child-modal-title"
        aria-describedby="child-modal-description"
      >
        <Box sx={{ ...style }}>
          <p id="child-modal-description">
            {infoClass("", "登入成功！BEEbeE歡迎您", "Oops! 登入失敗")}
          </p>
          <button
            className="btn btn-cancel"
            onClick={() => {
              infoState == 2 ? navigation("/") : handleClose();
            }}
            style={{ color: "gray" }}
          >
            確認
          </button>
        </Box>
      </Modal>
    </div>
  );
}

export default MemberLogin;
