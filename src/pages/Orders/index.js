import { Button, Table, message } from 'antd'
import './style.css'
import { useEffect, useState } from 'react'
import API from '../../api';
import { useSelector } from 'react-redux';
import printJS from 'print-js';
import { receipt } from '../NewOrder/receipt';
import moment from 'moment';
import { Navigate } from 'react-router-dom';



export const Orders = () => {
    const [orders, setOrders] = useState([])
    const [users, setUsers] = useState([])
    const { auth: { settings, user } } = useSelector((state) => state)
    const columns = [
        {
            title: 'Fatura',
            dataIndex: 'order',
            key: 'order',
        },
        {
            title: 'Perdoruesi',
            dataIndex: 'user',
            key: 'user',
            filters: users.map((e) => ({ text: e.fullname, value: e.fullname })),
            onFilter: (value, record) => record.user.includes(value),
        },
        {
            title: 'Nen Totali',
            dataIndex: 'subtotal',
            key: 'subtotal',
        },
        {
            title: 'Turni 3',
            dataIndex: 'extraNate',
            key: 'extraNate',
        },
        {
            title: 'Tax',
            dataIndex: 'tax',
            key: 'tax',
        },
        {
            title: 'Total',
            dataIndex: 'total',
            key: 'total',
        },
        {
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
            render: (_, record) => {
                return Date(record.date, 'dd/mm/yyyy hh:mm')
            },
            filters: [
                { value: 'sot', text: 'Sot' },
                { value: 'dje', text: 'Dje' },
                { value: 'keteJave', text: 'Kete Jave' },
                { value: 'lastWeek', text: 'Javen e kaluar' },
                { value: 'keteMuaj', text: 'Kete Muaj' },
                { value: 'lastMonth', text: 'Muajin e kaluar' },
            ],
            onFilter: (value, record) => {
                if (value === 'sot') {
                    let selected = moment(parseInt(record.date))
                    let startDate = moment().startOf('d');
                    let endDate = moment().endOf('d');
                    return selected.isBetween(startDate, endDate);
                }
                if (value === 'dje') {
                    let selected = moment(parseInt(record.date))
                    let startDate = moment().subtract(1, 'days').startOf('d');
                    let endDate = moment().subtract(1, 'days').endOf('d');
                    return selected.isBetween(startDate, endDate);
                }
                if (value === 'keteJave') {
                    let selected = moment(parseInt(record.date))
                    let startDate = moment().startOf('W');
                    let endDate = moment().endOf('W');
                    return selected.isBetween(startDate, endDate);
                }
                if (value === 'lastWeek') {
                    let selected = moment(parseInt(record.date))
                    let startDate = moment().subtract(1, 'weeks').startOf('W');
                    let endDate = moment().subtract(1, 'weeks').endOf('W');
                    return selected.isBetween(startDate, endDate);
                }
                if (value === 'lastMonth') {
                    let selected = moment(parseInt(record.date))
                    let startDate = moment().subtract(1, 'months').startOf('M');
                    let endDate = moment().subtract(1, 'months').endOf('M');
                    return selected.isBetween(startDate, endDate);
                }
                if (value === 'keteMuaj') {
                    let selected = moment(parseInt(record.date))
                    let startDate = moment().startOf('M');
                    let endDate = moment().endOf('M');
                    return selected.isBetween(startDate, endDate);
                }
            },
        },
        {
            title: 'Shiko Faturen',
            dataIndex: 'operation',
            key: 'operation',
            render: (_, record) => {
                return <Button onClick={() => {
                    printJS({
                        printable: receipt({
                            settings: settings.settings, order: record.items, date: Date(record.date, 'dd/mm/yyyy hh:mm'),
                            subTotal: parseFloat(record.subtotal),
                            totalVat: parseFloat(record.tax),
                            totalTurni3: parseFloat(record.extraNate),
                            orderTotal: parseFloat(record.total),
                            orderNumber: record.order,
                            user: record.user
                        }), type: 'raw-html'
                    })
                }}>
                    Shiko Faturen
                </Button>

            },
        },
    ];
    useEffect(() => {
        API.get('all').then((res) => {
            setOrders(res)
        }).catch(() => message.warning('Dicka shkoi keq'))
        API.get('users/all').then((res) => {
            setUsers(res)
        }).catch(() => message.warning('Dicka shkoi keq'))
    }, [])


    if (!user.perm_transactions) return <Navigate to='/newOrder' />

    return <>
        <div className='products-container'>
            <div className='products-container-table'>
                <Table pagination={false} footer={(currentPageData) => {
                    return <span>Total {currentPageData.reduce((a, c) => a = a + c.total, 0)}</span>;
                }} dataSource={orders} columns={columns} />
            </div>
        </div>
    </>
}
