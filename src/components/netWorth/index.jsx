const NetWorth = (props) => {
    return (props.CAD_balance + (props.BTC_balance * props.BTC_CAD_rate) + (props.ETH_balance * props.ETH_CAD_rate))
};

export default NetWorth;