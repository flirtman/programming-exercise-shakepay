import React from "react";
import Axios from "axios";


import NetWorth from '../../components/netWorth';

import './styles.scss';

const BTC_CAD_rate = 12601.31;
const ETH_CAD_rate = 285.05;
const CAD_balance = 1;
const BTC_balance = 3;
const ETH_balance = 5;

const rates = {
    CAD_BTC: 0.000079,
    BTC_CAD: 12657.73,
    CAD_ETH: 0.003504927856835348,
    ETH_CAD: 285.31,
    USD_BTC: 0.00010888,
    BTC_USD: 9184.32,
    USD_ETH: 0.00483045116413873,
    ETH_USD: 207.02,
    BTC_ETH: 44.35573297848747,
    ETH_BTC: 0.022545,
    CAD_USD: 0.72,
    USD_CAD: 1.37
};

/**
 *
 */

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
        };

        this.calculateTransactions = this.calculateTransactions.bind(this);
    }
    componentDidMount = async () => {
        const apiUrl = 'https://shakepay.github.io/programming-exercise/web/transaction_history.json';
        await Axios.get(apiUrl)
        .then(res => {
            this.setState({transaction: res.data});

            this.calculateTransactions(res.data);
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
        });

        this.setState({balance_cad: balance_cad});
        this.setState({balance_btc: balance_btc});
        this.setState({balance_eth: balance_eth});
    }
    render () {
        return (
            <>
                <ul>
                    <li>CAD: {this.state.balance_cad}</li>
                    <li>BTC: {this.state.balance_btc}</li>
                    <li>ETH: {this.state.balance_eth}</li>
                </ul>
                Net Worth: <NetWorth
                CAD_balance={this.state.balance_cad}
                BTC_balance={this.state.balance_btc}
                ETH_balance={this.state.balance_eth}
                BTC_CAD_rate={BTC_CAD_rate}
                ETH_CAD_rate={ETH_CAD_rate}
                />
            </>
        )
    }
}