export const receipt = ({ settings, order, date, subTotal, totalVat, totalTurni3, orderTotal, orderNumber, user }) => `<div style="font-size: 14px;">                            
<p style="text-align: center;">
    <span style="font-size: 22px;">${settings.store}</span> <br>
    ${settings.address_one} <br>
    ${settings.contact != '' ? 'Tel: ' + settings.contact + '<br>' : ''} 
</p>
<hr>
<left>
    <p style="font-size:14px">
    Order No : ${orderNumber} <br>
    Cashier : ${user} <br>
    Date : ${date}<br>
    </p>

</left>
<hr>
<table width="100%">
    <thead style="text-align: left;">
    <tr>
        <th style="font-size:14px">Item</th>
        <th style="font-size:14px">Qty</th>
        <th style="font-size:14px">Price</th>
    </tr>
    </thead>
    <tbody>
    ${order.map(item => `<tr><td  style="font-size:14px">` + (item.name || item.product_name) + `</td><td style="font-size:14px" >` + item.quantity + `</td><td style="font-size:14px">` + settings.symbol + parseFloat(item.price).toFixed(2) + `</td></tr style="font-size:14px">`).join('')}
<tr>
    <td><b style="font-size:14px">Nentotali</b></td>
    <td>:</td>
    <td style="font-size:14px"><b>${settings.symbol}${subTotal.toFixed(2)}</b></td style="font-size:14px">
</tr>
    ${settings.applyPercentage ? `<tr>
    <td style="font-size:14px">TVSH(${settings.percentage})% </td>
    <td style="font-size:14px">:</td>
    <td style="font-size:14px">${settings.symbol}${parseFloat(totalVat).toFixed(2)}</td>
</tr>`: ''
    }
${settings.nightShift ? `<tr>
<td style="font-size:14px">TURNI 3(${settings.nightShiftMethod === 'fixedPrice' ? `${settings.symbol}${settings.valueFixed}` : `${settings.valuePecentage}%`}) </td>
        <td style="font-size:14px">:</td>
            <td style="font-size:14px">${settings.symbol}${parseFloat(totalTurni3).toFixed(2)}</td>
</tr > `: ''
    }
<tr>
    <td><h2 >Total</h2></td>
    <td><h2>:</h2></td>
    <td>
        <h2>${settings.symbol}${parseFloat(orderTotal).toFixed(2)}</h2>
    </td>
</tr>
    </tbody >
    </table >
    <br>
        <hr>
            <br>
                <p style="text-align: center;">
                    ${settings.footer}
                </p>
            </div>`;