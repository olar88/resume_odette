import React from 'react'
import { useNavigate } from 'react-router-dom'

function LoginInfo(props) {
  const navigation = useNavigate()
  const { infoClass, setInfoState,infoState } = props
  return (
    <div
      className={infoClass(
        'loginpage-info',
        'loginpage-info info-login-success',
        'loginpage-info info-login-fail'
      )}
    >
      <p>{infoClass('', '登入成功！BEEbeE歡迎您', 'Oops! 登入失敗')}</p>
      <div className="btn-mygroup">
      {infoState === 2 ? <button
          href="#"
          className="btn-confirm"
          onClick={(e) => {
            e.preventDefault()
            setInfoState(1)
            navigation('/')
            //導回首頁
          }}
        >
          確定
        </button>:
          <button
          href="#"
          className="btn-confirm"
          onClick={(e) => {
            e.preventDefault()
            setInfoState(1)
            navigation('')
            //導回首頁
          }}
        >
          確定
        </button>
        }
       

        
      </div>
    </div>
  )
}

export default LoginInfo
