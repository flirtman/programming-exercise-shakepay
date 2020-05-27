const NetWorth = (obj) => {
    return (obj.CAD_balance + (obj.BTC_balance * obj.BTC_CAD_rate) + (obj.ETH_balance * obj.ETH_CAD_rate)).toFixed(2);
};

export default NetWorth;