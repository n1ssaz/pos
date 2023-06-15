import { Button, Input, InputNumber, Table, message } from 'antd'
import './style.css'
import { createElement, useEffect, useState } from 'react';
import API from '../../api';
import { useSelector } from 'react-redux';
import { receipt } from './receipt'
import printJS from 'print-js';
function checkTime() {
    var d = new Date(); // current time
    var hours = d.getHours();

    return hours >= process.env.REACT_APP_START
        && hours < process.env.REACT_APP_END;
}
export const NewOrder = () => {
    const [currentOrder, setCurrentOrder] = useState([])
    const { settings, user } = useSelector((state) => state.auth)
    const hasTax = settings.settings.applyPercentage
    const taxValue = settings.settings.percentage || 0
    const hasNightShift = settings.settings.nightShift
    const nightShiftMethod = settings.settings.nightShiftMethod
    const valueFixed = settings.settings.valueFixed
    const valuePecentage = settings.settings.valuePecentage
    const [products, setProducts] = useState([])
    const [value, setValue] = useState('')
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
            render: (text, record, index) => (
                <InputNumber value={parseFloat(text)} onChange={onInputChange("quantity", index)} />
            )
        },
        {
            title: 'Cmimi',
            dataIndex: 'price',
            key: 'price',
            render: (text, record, index) =>
                parseFloat(record.price)
        },
        {
            title: 'TVSH',
            dataIndex: 'tax',
            key: 'tax',
            render: (text, record, index) =>
                record.tax + '%'
        },
        {
            title: 'Extra Nate',
            dataIndex: 'extraNate',
            key: 'extraNate',
            render: (text, record, index) =>
                hasNightShift ? checkTime() ? nightShiftMethod === 'fixedPrice' ?
                    parseFloat(valueFixed) : parseFloat(valuePecentage) + '%' : 0 : 0
        },
        {
            title: 'Total',
            dataIndex: 'total',
            key: 'total',
            render: (text, record, index) => calculateRowTotal(record)
        },
        {
            title: 'Fshij',
            dataIndex: 'fshij',
            key: 'fshij',
            render: (text, record, index) => <Button onClick={() => setCurrentOrder((prev) => prev.filter(({ barcode }) => barcode !== record.barcode))}>Fshij</Button>
        }
    ];

    const calculateRowTotal = (record) => {
        let val =
            (parseFloat(record.price) * parseInt(record.quantity))
        if (hasNightShift && checkTime()) {
            if (nightShiftMethod === 'fixedPrice') {
                if (parseFloat(val) !== 0) {
                    val = val + (parseFloat(valueFixed) * parseInt(record.quantity))
                }
            } else {
                val = val + ((val * parseFloat(valuePecentage)) / 100)
            }
        }
        val = val + (val * ((parseFloat(record.tax) / 100)))
        return parseFloat(val.toFixed(2))
    }

    const calculateExtraNateTotal = (record) => {
        let val =
            (parseFloat(record.price) * parseInt(record.quantity))
        if (hasNightShift && checkTime()) {
            if (nightShiftMethod === 'fixedPrice') {
                if (parseFloat(val) !== 0) {
                    val = parseFloat(valueFixed) * parseInt(record.quantity)
                }
            } else {
                val = ((val * parseFloat(valuePecentage)) / 100)
            }
        } else val = 0

        return parseFloat(val.toFixed(2))
    }

    const calculateTaxTotal = (record) => {
        let val =
            (parseFloat(record.price) * parseInt(record.quantity))
        if (hasNightShift && checkTime()) {
            if (nightShiftMethod === 'fixedPrice') {
                if (parseFloat(val) !== 0) {
                    val = val + (parseFloat(valueFixed) * parseInt(record.quantity))
                }
            } else {
                val = val + ((val * parseFloat(valuePecentage)) / 100)
            }
        }
        val = (val * ((parseFloat(record.tax) / 100)))
        return parseFloat(val.toFixed(2))
    }

    const calculatePriceTotal = (record) => {
        let val =
            (parseFloat(record.price) * parseInt(record.quantity))
        return parseFloat(val.toFixed(2))
    }


    const onInputChange = (key, index) => (e) => {
        const newData = [...currentOrder];
        newData[index][key] = Number(e);
        newData[index]['total'] = calculateRowTotal(newData[index])
        newData[index]['extraNateTotal'] = calculateExtraNateTotal(newData[index])
        newData[index]['extraTaxTotal'] = calculateTaxTotal(newData[index])
        newData[index]['totalPrice'] = calculatePriceTotal(newData[index])
        setCurrentOrder(newData);
    };

    const addToCardByOnChange = (el) => {
        const selectedProduct = products?.find((e) => e?.barcode?.toString() === el)
        if (selectedProduct) {
            const existedProduct = currentOrder?.find((e) => e.barcode === selectedProduct.barcode)
            if (existedProduct) {
                setCurrentOrder((prev) => [{ ...existedProduct, tax: hasTax ? taxValue : 0, quantity: existedProduct.quantity + 1 }, ...prev.filter((e) => e.barcode !== existedProduct.barcode)])
                setValue('')
            } else {
                setCurrentOrder((prev) => [...prev, { ...selectedProduct, tax: hasTax ? taxValue : 0, quantity: 1 }])
                setValue('')
            }
        } else {
            setValue(el)
        }
    }

    const addToCardBySearchEnter = () => {
        const selectedProduct = products?.find((e) => e?.barcode?.toString() === value)
        if (selectedProduct) {
            const existedProduct = currentOrder?.find((e) => e.barcode === selectedProduct.barcode)
            if (existedProduct) {
                setCurrentOrder((prev) => [{ ...existedProduct, tax: hasTax ? taxValue : 0, quantity: existedProduct.quantity + 1 }, ...prev.filter((e) => e.barcode !== existedProduct.barcode)])
                setValue('')
            } else {
                setCurrentOrder((prev) => [...prev, { ...selectedProduct, tax: hasTax ? taxValue : 0, quantity: 1 }])
                setValue('')
            }
        }
    }

    useEffect(() => {
        API.get('products/products').then(setProducts).catch(() => message.warning('Dicka shkoi keq'))
    }, [])

    const saveOrder = async () => {
        if (currentOrder.length) {
            const item = await API.post('/new', {
                subtotal: currentOrder.reduce((a, c) => a = a + (calculatePriceTotal(c) || 0), 0),
                tax: currentOrder.reduce((a, c) => { return a = a + (calculateTaxTotal(c) || 0) }, 0),
                items: [...currentOrder.map((e) => ({ id: e._id, product_name: e.name, barcode: e.barcode, price: parseFloat(e.price), quantity: parseFloat(e.quantity) }))],
                total: currentOrder.reduce((a, c) => { return a = a + (calculateRowTotal(c) || 0) }, 0),
                extraNate: currentOrder.reduce((a, c) => { return a = a + (calculateExtraNateTotal(c) || 0) }, 0),
                user: user.fullname,
                user_id: user._id
            })
            printJS({
                printable: receipt({
                    settings: settings.settings, order: currentOrder, date: Date(item.date, 'dd/mm/yyyy hh:mm'),
                    subTotal: currentOrder.reduce((a, c) => a = a + (calculatePriceTotal(c) || 0), 0),
                    totalVat: currentOrder.reduce((a, c) => { return a = a + (calculateTaxTotal(c) || 0) }, 0),
                    totalTurni3: currentOrder.reduce((a, c) => { return a = a + (calculateExtraNateTotal(c) || 0) }, 0),
                    orderTotal: currentOrder.reduce((a, c) => { return a = a + (calculateRowTotal(c) || 0) }, 0),
                    orderNumber: item.order,
                    user: user.fullname
                }), type: 'raw-html', style: ['@page { margin: 0mm;} body {margin: 0; height:auto} h4 {margin:0}'], targetStyles: ['*'],
            })
        } else {
            message.info('Ju duhet te shtoni te pakten nje produkt ne fature')
        }
    }

    return <div className="new-order-container">
        <div className='new-order-container-order-form'>
            <Input value={value} onChange={(e) => {
                addToCardByOnChange(e.target.value)
            }} onPressEnter={addToCardBySearchEnter} placeholder='Vendosni barcodin' />
            <Table key='table' pagination={false} dataSource={currentOrder} columns={columns} />
            <span>Nen Totali {currentOrder.reduce((a, c) => a = a + (calculatePriceTotal(c) || 0), 0)}</span>
            <span>Tax Totali {currentOrder.reduce((a, c) => { return a = a + (calculateTaxTotal(c) || 0) }, 0)}</span>
            <span>Turni 3 Totali {currentOrder.reduce((a, c) => { return a = a + (calculateExtraNateTotal(c) || 0) }, 0)}</span>
            <span>Totali {currentOrder.reduce((a, c) => { return a = a + (calculateRowTotal(c) || 0) }, 0)}</span>
            <Button onClick={() => saveOrder().then(() => setCurrentOrder([]))}>Ruaj</Button>
        </div>
    </div >
}