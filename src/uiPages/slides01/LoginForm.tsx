export default function LoginForm(props: {
    activeClass: (a: string, b: string, c: string) => string,
    show: string,
    setShow: (aa: boolean) => void
}) {
    const { activeClass, show, setShow } = props

    return (
        <>
            <div
                className={activeClass(
                    'form_area',
                    'login_form_out form_area',
                    'login_form_out form_area'
                )}
            >
                <div className="login_form_title">Welcome back</div>

                <div className="now_page login_mobile_hidden">Log in</div>

                <form
                    name="login_form"
                    className="login_form"
                    onSubmit={(e) => {
                        e.preventDefault()

                    }}
                >
                    <div className="form_box">
                        <label className="label">E-mail</label>
                        <input
                            type="text"
                            placeholder="E-mail"
                            name="email"
                            className="form_input"
                        />
                        <div className="login_input_alert_info input_alert_true">
                        </div>
                    </div>
                    <div className="form_box">
                        <label className="label">密碼</label>
                        <input
                            type={show ? 'text' : 'password'}
                            placeholder="Password"
                            name="password"
                            className="form_input"
                        />
                        <div onMouseDown={() => {
                            setShow(true)
                        }} onMouseUp={() => {
                            setShow(false)
                        }}
                            className="changeEye">
                            {show ? <i className="fa-solid fa-eye"></i> : <i className="fa-solid fa-eye-slash"></i>}
                        </div>
                    </div>


                    <div className="form_btn">
                        {/* <button
              onClick={(e) => {
                e.preventDefault()
              }}
              className="loginPage_button forget_pass_btn"
            >
              忘記密碼
            </button> */}
                        <button type="submit" className="loginPage_button login_form_btn">
                            登入
                        </button>
                    </div>

                    <div className="form_btn">
                        <button
                            className="loginPage_button google_login_btn">
                            <i className="fa-brands fa-google" style={{ color: "#DB4437" }}></i> Google 登入
                        </button>
                    </div>
                </form>
            </div>
        </>
    )
}