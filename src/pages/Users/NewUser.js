import { Checkbox, Form, Input } from "antd"
import './style.css'
export const NewUser = () => {
    return <div className="new-product-container">
        <Form.Item name='username' required>
            <Input placeholder="Username" />
        </Form.Item>
        <Form.Item name='fullname' required>
            <Input placeholder="Emri" />
        </Form.Item>
        <Form.Item name='password' required>
            <Input placeholder="Password" />
        </Form.Item>
        <Form.Item name='perm_products' label='Produktet' valuePropName="checked">
            <Checkbox />
        </Form.Item>
        <Form.Item name='perm_transactions' label='Faturat' valuePropName="checked">
            <Checkbox />
        </Form.Item>
        <Form.Item name='perm_users' label='Perdoruesit' valuePropName="checked">
            <Checkbox />
        </Form.Item>
        <Form.Item name='perm_settings' label='Settings' valuePropName="checked">
            <Checkbox />
        </Form.Item>
    </div>
}