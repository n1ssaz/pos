import { Button, Form, Input } from 'antd'
import './style.css'
import { useForm } from 'antd/es/form/Form'
import API from '../../api'
import { Navigate } from 'react-router-dom'
import Actions from '../../Store/Actions'
import { useSelector } from 'react-redux'
export const LoginContainer = () => {
    const [form] = useForm()
    const { isLogged } = useSelector((state) => state.auth)
    const login = () => API.post('/users/login', JSON.stringify(form.getFieldsValue()))
        .then((res) => {
            localStorage.setItem('isLogged', true)
            localStorage.setItem('userid', res._id)
            Actions.setLogin()
            Actions.setUser(res)
            window.location.reload()
        }
        ).catch((err) => console.log(err))
    if (isLogged) return <Navigate to='/' />
    return (
        <div className="login-page">
            <Form layout="vertical" form={form}>
                <div className='login-page-form'>
                    <Form.Item label='Username' name='username'>
                        <Input placeholder='Username' />
                    </Form.Item>
                    <Form.Item label='Password' name='password'>
                        <Input type='password' placeholder='Password' />
                    </Form.Item>
                    <Button onClick={login}>Hyr</Button>
                </div>
            </Form>
        </div>
    )
}