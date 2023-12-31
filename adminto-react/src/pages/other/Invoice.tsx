import { useEffect, useState } from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import LogoDark from '../../assets/images/logo-dark.png';
import LogoLight from '../../assets/images/logo-light.png';
// hooks
import { usePageTitle } from '../../hooks';

// data
import { invoiceDetails } from './data';
import { useRedux } from '../../hooks';
import { createSiparis } from '../../service/siparisler';
import { getSepet } from '../../service/sepet';
import { getCustomer } from '../../service/musteri';
import { updateProduct, updateStock } from '../../service/urunler';

const Invoice = () => {
    // set pagetitle

    usePageTitle({
        title: 'Invoice',
        breadCrumbItems: [
            {
                path: '/pages/invoice',
                label: 'Extra Pages',
            },
            {
                path: '/pages/invoice',
                label: 'Invoice',
                active: true,
            },
        ],
    });

    const { dispatch, appSelector } = useRedux();

    const token = localStorage.getItem('token') || '';

    const [countProforma, setCountProforma] = useState(0);
    const musteri = appSelector((state) => state.Musteriler.musteriler);
    console.log(musteri);
    const currentDate = new Date();
    const day = currentDate.getDate();
    const monthNames = [
        'Ocak',
        'Şubat',
        'Mart',
        'Nisan',
        'Mayıs',
        'Haziran',
        'Temmuz',
        'Ağustos',
        'Eylül',
        'Ekim',
        'Kasım',
        'Aralık',
    ];
    const monthIndex = currentDate.getMonth();
    const month = monthNames[monthIndex];
    const year = currentDate.getFullYear();
    const formattedDate = `${day} ${month} ${year}`;

    const [proformaNumber, setProformaNumber] = useState(1);
    const [customerInfo, setCustomerInfo] = useState<any>({});

    console.log(formattedDate);

    console.log(formattedDate);

    const [sepet, setSepet] = useState<any>([]);

    const customerId = localStorage.getItem('customerId') || '';

    const parsedCustomerId = parseInt(customerId);

    useEffect(() => {
        handleGetSepet();
    }, [setSepet]);
    console.log(sepet);
    console.log(musteri);
    const itemCount = sepet.length;

    useEffect(() => {
        handleGetCustomer();
    }, [setSepet]);

    // Calculate subtotal dynamically
    const subTotal = sepet.reduce((total: any, item: any) => total + item.quantity * item.products.price, 0);

    useEffect(() => {
        // Update the order number when a new order is created
        setProformaNumber((prevNumber) => prevNumber + 1);
    }, []);

    const handleSaveOrder = async () => {
        try {
            const data = {
                customerId: parsedCustomerId,
                stateId: 1,
                createdAt: formattedDate,
                products: sepet,
                price: subTotal,
                quantity: itemCount,
                toplamFiyat: subTotal,
            };
            console.log(data);
            const res = await createSiparis(data, token);
            console.log(res);

            for (const item of sepet) {
                const updatedStock = item.products.stock - item.quantity;
                console.log(updatedStock);
                // Ürünün stok sayısını güncelleme işlemini yapmak için ilgili servisi kullanabilirsiniz
                await updateStock(item.products.id, updatedStock, token);
            }
        } catch (error) {
            console.log(error);
        }
    };


    const handleFinishClick = () => {
        // Yönlendirmek istediğiniz sayfa yolunu buraya yazın

        setCountProforma(countProforma + 1);
        handleSaveOrder();
        // window.location.href = '/apps/siparisler';
    };

    const handleGetSepet = async () => {
        try {
            const response = await getSepet(token);
            console.log(response);
            setSepet(response);
        } catch (error) {
            console.log(error);
        }
    };

    const handleGetCustomer = async () => {
        try {
            const response = await getCustomer(parsedCustomerId, token);
            console.log(response);
            setCustomerInfo(response);
        } catch (error) {
            console.log(error);
        }
    };


    return (
        <Row>
            <Col md={12}>
                <Card>
                    <Card.Body>
                        <div className="panel-body">
                            <div className="clearfix">
                                <div className="float-start">
                                    <span className="logo-lg">
                                        <img src={LogoDark} alt="" height="22" />
                                    </span>
                                </div>
                                <div className="float-end">
                                    <h4>
                                        Proforma #
                                        <br />
                                        <strong>{`${day}${monthIndex + 1}${year}${countProforma}`}</strong>
                                    </h4>
                                </div>
                            </div>
                            <hr />
                            <Row>
                                <Col md={12}>
                                    <div className="float-start mt-3">
                                        <address>
                                            <strong>{customerInfo.firmName}</strong>
                                            <br />
                                            {customerInfo.address}
                                            <br />
                                            <abbr title="Phone">Telefon:</abbr> {customerInfo.phone}
                                            <br />
                                            <abbr title="İsim">İsim:</abbr> {customerInfo.name}
                                            <br />
                                            <abbr title="Email">Email:</abbr> {customerInfo.email}
                                        </address>
                                    </div>
                                    <div className="float-end mt-3">
                                        <p>
                                            <strong>Sipariş Oluşturulma Tarihi: </strong> {formattedDate}
                                        </p>
                                        <p className="m-t-10">
                                            <strong>Sipariş Durumu: </strong>{' '}
                                            <span className="label label-pink">{invoiceDetails.order_status}</span>
                                        </p>
                                        <p className="m-t-10">
                                            <strong>Sipariş Numarası: {proformaNumber} </strong>
                                        </p>
                                    </div>
                                </Col>
                            </Row>

                            <Row>
                                <Col md={12}>
                                    <div className="table-responsive">
                                        <table className="table mt-4">
                                            <thead>
                                                <tr>
                                                    <th>#</th>
                                                    <th>Ürün</th>
                                                    <th>Özellikler</th>
                                                    <th>Adet</th>
                                                    <th>Birim Fiyat</th>
                                                    <th>Toplam</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {sepet.map((item: any, index: any) => {
                                                    return (
                                                        <tr key={item.id}>
                                                            <td>{index + 1}</td>
                                                            <td>{item.products.title}</td>
                                                            <td
                                                                style={{
                                                                    width: '200px',
                                                                }}>
                                                                {item.products.customInputs.map(
                                                                    (input: any, index: number) => (
                                                                        <div key={index.toString()}>
                                                                            <h5 className="m-0">{input.key}</h5>
                                                                            <p className="m-0">{input.value}</p>
                                                                        </div>
                                                                    )
                                                                )}
                                                            </td>
                                                            <td>{item.quantity}</td>
                                                            <td>{item.products.price}</td>
                                                            <td>{item.quantity * item.products.price}</td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                </Col>
                            </Row>
                            <Row>
                                <Col xl={6} xs={6} className="col-xl-6 col-6">
                                    <div className="clearfix mt-4">
                                        <h5 className="small text-dark fw-normal">Ödeme Politikası</h5>

                                        <small>
                                            All accounts are to be paid within 7 days from receipt of invoice. To be
                                            paid by cheque or credit card or direct payment online. If account is not
                                            paid within 7 days the credits details supplied as confirmation of work
                                            undertaken will be charged the agreed quoted fee noted above.
                                        </small>
                                    </div>
                                </Col>
                                <Col xs={6} xl={{ offset: 3, span: 3 }} className="col-xl-3 col-6 offset-xl-3">
                                    <p className="text-end">
                                        <b>Tutar:</b> {subTotal}
                                    </p>

                                    <p className="text-end">KDV: {invoiceDetails.vat}%</p>
                                    <hr />
                                    <h3 className="text-end">TL {subTotal * 1.2}</h3>
                                </Col>
                            </Row>
                            <hr />
                            <div className="d-print-none">
                                <div className="float-end">
                                    <Link
                                        to="#"
                                        className="btn btn-dark waves-effect waves-light me-1"
                                        onClick={(e) => {
                                            window.print();
                                        }}>
                                        <i className="fa fa-print"></i>
                                    </Link>
                                    <Link to="/apps/siparisler">
                                        <button
                                            className="btn btn-primary waves-effect waves-light"
                                            onClick={handleFinishClick}>
                                            Bitir
                                        </button>
                                    </Link>
                                </div>
                                <div className="clearfix"></div>
                            </div>
                        </div>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    );
};

export default Invoice;
