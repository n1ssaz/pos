import { useSelector } from 'react-redux'
import './style.css'
import { Button, Checkbox, Form, Input, InputNumber, Select } from 'antd'
import { Navigate, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useForm } from 'antd/es/form/Form'
import API from '../../api'

export const Settings = () => {
    const [form] = useForm()
    const { settings, user } = useSelector((state) => state.auth)
    const [selectedNightShiftMethod, setSelectedNightShiftMethod] = useState(settings?.settings?.nightShiftMethod || '')
    const navigate = useNavigate()
    if (!user.perm_settings) return <Navigate to='/newOrder' />
    return <div className="settings-page-container">
        <div>
            <Button onClick={() => navigate('/')}>Mbrapa</Button>
            <Button onClick={() => form.validateFields().then(async (val) => {
                await API.post('/settings/post', val)
                window.location.reload()
            })}>Ruaj</Button>
        </div>
        <Form form={form} layout='vertical' initialValues={settings?.settings || {}}>
            <Form.Item name='store' label='Emri i dyqanit'>
                <Input />
            </Form.Item>
            <Form.Item name='symbol' label='Valuta'>
                <Input />
            </Form.Item>
            <Form.Item name='address_one' label='Adresa'>
                <Input />
            </Form.Item>
            <Form.Item name='contact' label='Kontakt'>
                <Input />
            </Form.Item>
            <Form.Item name='footer' label='Fundi i fatures'>
                <Input />
            </Form.Item>
            <Form.Item name='percentage' label='Tax'>
                <Input />
            </Form.Item>
            <Form.Item valuePropName="checked" name='applyPercentage' label='Apliko Taksen'>
                <Checkbox />
            </Form.Item>
            <Form.Item valuePropName="checked" name='nightShift' label='Apliko Turnin e 3'>
                <Checkbox />
            </Form.Item>
            <Form.Item name='nightShiftMethod' label='Metoda e aplikimit te turnit te 3'>
                <Select onChange={(e) => setSelectedNightShiftMethod(e)} options={[{ label: 'Vlere fikse', value: 'fixedPrice' }, { label: 'Vlera ne perqindje', value: 'percentagePrice' }]} />
            </Form.Item>
            {selectedNightShiftMethod === 'percentagePrice' &&
                <Form.Item name='valuePecentage' label='Vlera'>
                    <InputNumber />
                </Form.Item>}
            {selectedNightShiftMethod === 'fixedPrice' &&
                <Form.Item name='valueFixed' label='Vlera'>
                    <InputNumber />
                </Form.Item>}

        </Form>
    </div >
}