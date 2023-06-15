import { Button, Form, Input, message } from "antd"
import { useForm } from "antd/es/form/Form"
import API from "../../api"
import './Profile.css'
import { useSelector } from "react-redux"
import { Base64 } from "js-base64"

export const Profile = () => {
    const [form] = useForm()
    const { user } = useSelector((state) => state.auth)

    return <div className="profile-page-container">
        <Form form={form} initialValues={{ ...user, password: Base64.decode(user.password) }}>
            <Form.Item name='username'>
                <Input placeholder='Username' />
            </Form.Item>
            <Form.Item name='fullname'>
                <Input placeholder='Emri' />
            </Form.Item>
            <Form.Item name='password'>
                <Input type="password" placeholder='Password' />
            </Form.Item>
            <Button onClick={() => {
                form.validateFields().then(() => {
                    API.put(`users/user/${localStorage.getItem('userid')}`, { ...user, ...form.getFieldsValue() }).then((res) => {
                        window.location.reload()
                        form.resetFields()
                    }).catch((e) => message.warning('Dicka shkoi keq'))
                })
            }}>Ruaj</Button>
        </Form>
    </div>
}