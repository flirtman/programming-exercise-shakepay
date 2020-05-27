import React from "react";
import Axios from "axios";
import {Table, Container} from "react-bootstrap";

import NetWorth from '../../components/netWorth';


import './styles.scss';
import {MDBDataTable} from "mdbreact";

const BTC_CAD_rate = 12601.31;
const ETH_CAD_rate = 285.05;


export default class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            transaction : [
                {
                    createdAt: "2020-04-06T20:34:32.796Z",
                    amount: 0.002,
                    currency: "BTC",
                    type: "external account",
                    direction: "debit",
                    to: {
                        toAddress: "btc:2N2DZtj1SfcGkaeHA72eZAYBrFbyMZoHVmE"
                    }
                }
            ],
            balance_cad: 0,
            balance_btc: 0,
            balance_eth: 0,
            tableRows: []
        };

        this.calculateTransactions = this.calculateTransactions.bind(this);
        this.createRows = this.createRows.bind(this);
    }
    componentDidMount = async () => {
        const apiUrl = 'https://shakepay.github.io/programming-exercise/web/transaction_history.json';
        await Axios.get(apiUrl)
        .then(res => {
            this.setState({transaction: res.data});

            this.calculateTransactions(res.data);

            this.createRows(res.data);
        });
    };
    calculateTransactions (transactions) {
        /**
         * Following logic can be simplified and compressed if more development time provided
         */

        let balance_cad = 0;
        let balance_btc = 0;
        let balance_eth = 0;

        transactions.filter( function (trans) {
            if(trans.type === 'peer' && trans.to) {
                if(trans.currency === "CAD") balance_cad -= trans.amount;
                if(trans.currency === "BTC") balance_btc -= trans.amount;
                if(trans.currency === "ETH") balance_eth -= trans.amount;
            }
            if(trans.type === 'peer' && trans.from) {
                if(trans.currency === "CAD") balance_cad += trans.amount;
                if(trans.currency === "BTC") balance_btc += trans.amount;
                if(trans.currency === "ETH") balance_eth += trans.amount;
            }

            if(trans.type === 'external account' && trans.to) {
                if(trans.currency === "CAD") balance_cad -= trans.amount;
                if(trans.currency === "BTC") balance_btc -= trans.amount;
                if(trans.currency === "ETH") balance_eth -= trans.amount;
            }
            if(trans.type === 'external account' && trans.from) {
                if(trans.currency === "CAD") balance_cad += trans.amount;
                if(trans.currency === "BTC") balance_btc += trans.amount;
                if(trans.currency === "ETH") balance_eth += trans.amount;
            }

            if(trans.type === 'conversion') {

                if(trans.from.currency === "CAD") {
                    balance_cad -= trans.amount;
                }
                if(trans.from.currency === "BTC") {
                    balance_btc -= trans.amount;
                }
                if(trans.from.currency === "ETH") {
                    balance_eth -= trans.amount;
                }

                if(trans.to.currency === "CAD") {
                    balance_cad += trans.to.amount;
                }
                if(trans.to.currency === "BTC") {
                    balance_btc += trans.to.amount;
                }
                if(trans.to.currency === "ETH") {
                    balance_eth += trans.to.amount;
                }
            }

            return 'ok';
        });

        this.setState({balance_cad: balance_cad});
        this.setState({balance_btc: balance_btc});
        this.setState({balance_eth: balance_eth});
    }
    createRows (transactions) {

        let rows = [];

        transactions.map((elem) => (
            rows.push({
                date : elem.createdAt,
                amount : elem.amount,
                currency : elem.currency,
                transit_type : elem.type,
                direction : elem.direction
            })
        ));


        this.setState({tableRows: rows})
    }
    dataTable () {
        const data = {
            columns: [
                {
                    label: 'Date',
                    field: 'date',
                    sort: 'asc',
                    width: 150
                },
                {
                    label: 'Amount',
                    field: 'amount',
                    sort: 'asc',
                    width: 270
                },
                {
                    label: 'Currency',
                    field: 'currency',
                    sort: 'asc',
                    width: 200
                },
                {
                    label: 'Transit type',
                    field: 'transit_type',
                    sort: 'asc',
                    width: 100
                },
                {
                    label: 'direction',
                    field: 'direction',
                    sort: 'asc',
                    width: 150
                }
            ],
            rows: this.state.tableRows
        };

        return (
            <MDBDataTable
                striped
                bordered
                small
                data={data}
            />
        );
    }
    render () {
        return (
            <>
                <Container>
                    <br/>
                    <h1 className={'text-center'}>Programming Exercise ShakePay</h1>

                    <h3>BALANCE</h3>
                    <Table striped bordered hover>

                        <thead>
                        <tr>
                            <th>CAD</th>
                            <th>BTC</th>
                            <th>ETH</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td>${this.state.balance_cad.toFixed(2)}</td>
                            <td>{this.state.balance_btc}</td>
                            <td>{this.state.balance_eth}</td>
                        </tr>
                        </tbody>
                    </Table>

                    <strong>
                        Net Worth in CAD:  {NetWorth({
                        CAD_balance: this.state.balance_cad,
                        BTC_balance: this.state.balance_btc,
                        ETH_balance: this.state.balance_eth,
                        BTC_CAD_rate: BTC_CAD_rate,
                        ETH_CAD_rate: ETH_CAD_rate
                    })}
                    </strong>

                    <hr/>

                    <h3>TRANSACTIONS HISTORY</h3>
                    { this.state.tableRows.length > 0 && (
                        this.dataTable()
                    )}


                </Container>
            </>
        )
    }
}