import { Form, Input } from "antd"
import './style.css'
export const NewProduct = () => {
    return <div className="new-product-container">
        <Form.Item name='barcode' required>
            <Input placeholder="Barcode" />
        </Form.Item>
        <Form.Item name='name' required>
            <Input placeholder="Emri i produktit" />
        </Form.Item>
        <Form.Item name='price' required>
            <Input placeholder="Cmimi" />
        </Form.Item>
        <Form.Item name='quantity' required>
            <Input placeholder="Sasia" />
        </Form.Item>
    </div>
}