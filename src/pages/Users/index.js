import { Button, Form, Input, Modal, Space, Table, message } from 'antd'
import './style.css'
import { useEffect, useState } from 'react'
import API from '../../api';
import { NewUser } from './NewUser';
import { useForm } from 'antd/es/form/Form';
import { Base64 } from 'js-base64';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';



export const Users = () => {
    const [users, setUsers] = useState([])
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [filteredUsers, setFilteredUsers] = useState([])
    const [form] = useForm()

    const { auth: { user } } = useSelector((state) => state)
    console.log(user)
    const columns = [
        {
            title: 'Username',
            dataIndex: 'username',
            key: 'username',
        },
        {
            title: 'Emri',
            dataIndex: 'fullname',
            key: 'fullname',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
        },
        {
            title: 'Veprime',
            dataIndex: 'operation',
            key: 'operation',
            render: (_, record) => {
                return (
                    <Space size="middle">
                        <a onClick={() => showModal(record._id)}>Edit</a>
                        <a onClick={() => API.delete(`users/user/${record._id}`).then(() => {
                            setUsers((res) => res.filter((e) => e._id !== record._id))
                            setFilteredUsers((res) => res.filter((e) => e._id !== record._id))
                        }).catch(() => message.warning('Dicka shkoi keq'))}>Delete</a>
                    </Space>
                )
            },
        },
    ];
    const showModal = (id) => {
        setIsModalOpen({ visible: true, id });
        form.setFieldsValue({ ...users.find(({ _id }) => _id === id), password: Base64.decode(users?.find(({ _id }) => _id === id)?.password || '') })
    };

    const handleOk = () => {
        form.validateFields().then(() => {
            if (isModalOpen?.id) {
                API.put(`users/user/${isModalOpen?.id}`, form.getFieldsValue()).then((res) => {
                    setUsers((rest) => [...rest.filter((el) => el._id !== isModalOpen?.id), res])
                    setFilteredUsers((rest) => [...rest.filter((el) => el._id !== isModalOpen?.id), res])
                    form.resetFields()
                    setIsModalOpen(false);
                }).catch((e) => message.warning('Dicka shkoi keq'))
            } else {
                API.post('users/post', form.getFieldsValue()).then((res) => {
                    setUsers((rest) => [res, ...rest])
                    setFilteredUsers((rest) => [res, ...rest])
                    form.resetFields()
                    setIsModalOpen(false);
                }).catch((e) => message.warning('Dicka shkoi keq'))
            }

        }).catch((e) => { })
    };

    const handleCancel = () => {
        form.resetFields()
        setIsModalOpen(false);
    };
    const filterProducts = (e) => {
    }
    useEffect(() => {
        API.get('users/all').then((res) => {
            setUsers(res)
            setFilteredUsers(res)
        }).catch(() => message.warning('Dicka shkoi keq'))
    }, [])

    if (!user.perm_users) return <Navigate to='/newOrder' />
    return <>
        <div className='products-container'>
            <div className='products-container-actions'>
                <Input onChange={filterProducts} placeholder='Kerko nga barcodi ose nga emri' />
                <Button onClick={() => showModal()}>Shto Perdorues</Button>
            </div>
            <div className='products-container-table'>
                <Table pagination={false} dataSource={filteredUsers} columns={columns} />
            </div>
        </div>
        <Modal title={isModalOpen?.id ? "Shto Perdorues" : "Ndrysho perdorues"} open={isModalOpen?.visible} onOk={handleOk} onCancel={handleCancel}>
            <Form form={form} >
                <NewUser key={isModalOpen} />
            </Form>
        </Modal >
    </>
}

export * from './NewUser'