import { Button, Form, Input, Modal, Space, Table, message } from 'antd'
import './style.css'
import { useEffect, useState } from 'react'
import API from '../../api';
import { NewProduct } from './NewProduct';
import { useForm } from 'antd/es/form/Form';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';



export const Products = () => {
    const [products, setProducts] = useState([])
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [filteredProducts, setFilteredProducts] = useState([])
    const [form] = useForm()
    const { auth: { user } } = useSelector((state) => state)

    const columns = [
        {
            title: 'Barcode',
            dataIndex: 'barcode',
            key: 'barcode',
        },
        {
            title: 'Produkti',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Sasia',
            dataIndex: 'quantity',
            key: 'quantity',
        },
        {
            title: 'Veprime',
            dataIndex: 'operation',
            key: 'operation',
            render: (_, record) => {
                return (
                    <Space size="middle">
                        <a onClick={() => showModal(record._id)}>Edit</a>
                        <a onClick={() => API.delete(`products/product/${record._id}`).then(() => {
                            setProducts((res) => res.filter((e) => e._id !== record._id))
                            setFilteredProducts((res) => res.filter((e) => e._id !== record._id))
                        }).catch(() => message.warning('Dicka shkoi keq'))}>Delete</a>
                    </Space>
                )
            },
        },
    ];
    const showModal = (id) => {
        setIsModalOpen({ visible: true, id });
        form.setFieldsValue(products.find(({ _id }) => _id === id) || {})
    };

    const handleOk = () => {
        form.validateFields().then((response) => {
            if (isModalOpen?.id) {
                API.put(`products/product/${isModalOpen?.id}`, form.getFieldsValue()).then((res) => {
                    setProducts((rest) => [...rest.filter((el) => el._id !== isModalOpen?.id), response])
                    setFilteredProducts((rest) => [...rest.filter((el) => el._id !== isModalOpen?.id), response])
                    form.resetFields()
                    setIsModalOpen(false);
                }).catch((e) => message.warning('Dicka shkoi keq'))
            } else {
                API.post('products/product', form.getFieldsValue()).then((res) => {
                    setProducts((rest) => [res, ...rest])
                    setFilteredProducts((rest) => [res, ...rest])
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
    const filterProducts = (el) => {
        if (!el.target.value) {
            setFilteredProducts(products)
        } else {
            setFilteredProducts(products?.filter((e) => e?.barcode?.toString().includes(el.target.value)))
        }
    }
    useEffect(() => {
        API.get('products/products').then((res) => {
            setProducts(res)
            setFilteredProducts(res)
        }).catch(() => message.warning('Dicka shkoi keq'))
    }, [])

    if (!user.perm_products) return <Navigate to='/newOrder' />
    return <>
        <div className='products-container'>
            <div className='products-container-actions'>
                <Input onChange={filterProducts} placeholder='Kerko nga barcodi' />
                <Button onClick={() => showModal()}>Shto Produkt</Button>
            </div>
            <div className='products-container-table'>
                <Table pagination={false} dataSource={filteredProducts} columns={columns} />
            </div>
        </div>
        <Modal title={isModalOpen?.id ? "Edito Produkt" : "Shto Produkt"} open={isModalOpen?.visible} onOk={handleOk} onCancel={handleCancel}>
            <Form form={form}>
                <NewProduct key={isModalOpen} />
            </Form>
        </Modal>
    </>
}

export * from './NewProduct'