
/*
    Distance to Target:
    Long Target:
    Short Target:
    Return/Risk:
*/


function foo (data)
{

    // $.get('https://data.messari.io/api/v1/assets/btc/metrics', resp => {
    //     let price = resp.data.market_data.price_usd;
    //     i["BTC_Price"].val( price.toFixed(0) );
    // });
    return {
        rate: 8000, //btc rate
        amount: '',
        symbol: '',
        capital: 0.005,
        entryPrice: 7900,
        risk: 0, // %
        distanceToStop: 100,
        distanceToTarget: 100,

    calcd: {
        capital: 0, // capital * rate
        riskUSD: 0, // ( capital / 100 )  * risk                "The amount you lose if your Stop gets hit."
        riskBTC: 0, // ( caldc.capital / 100 )  * risk          "The amount you lose if your Stop gets hit."
        margin: 0,  // ( distanceToStop / entryPrice ) * 100    "%"
        leverage: 0, // cald.positionSize / riskUSD             "This is your Leverage. Select a Leverage from the Slider Bar that is LESS than this to ensure you get Stopped out not Liquidated."
        positionSize: 0,    // riskUSD * margin                 "This is based on your Risk Amount and Stop Loss. Enter this amount into the Quantity cell at BitMEX."
        maintananceMargin: 0,
        margin: 0, // (positionSize / rate) / cald.leverage
        distanceToTarget: 0, //  "(distanceToTarget / entryPrice) * 100"    %
        longStop: 0, // entryPrice - distanceToStop
        longTarget: 0,  // entryPrice + distanceToTarget
        shortStop: 0,   // entryPrice + distanceToStop
        shortTarget: 0, // entryPrice - distanceToTarget
        returnRisk: 0, // distanceToTarget / distanceToStop     "This should NOT be less than 1. Greater than 2 is good."
        takerFee: 0, // (0.0015 * positionSize) / rate
        costBTC: 0, // calcd.Initial_Margin + rsm.Taker_Fees      "The Cost to execute this trade. This is the most you can lose in Isolated Margin mode."
        costUSD: 0, //  calcd.Cost_BTC * rate"

        liqRate: {
            long: "entryPrice + (entryPrice * rl.Change_PL_P) / 100",
            short: "entryPrice + (entryPrice * rs.Change_PL_P) / 100",
            tooltip: "This is an ESTIMATE: Check this calculation with the BitMEX Calculator. Liquidation Price is the price at which the Liquidation Engine takes over your position. Liquidation is triggered by Mark Price (based on the BXBT Index) not Last Price. The engine closes your position with a limit order at the Bankruptcy Price. You pay Taker fees on this."
        },

        Change_PL_P: {
            name: "Change in Price to Liquidation (%)",
            long: "rl.Change_PB_P + (a.Adjusted_Long * 100)",
            short: "rs.Change_PB_P - (a.Adjusted_Short * 100)",
            tooltip: "A larger % & $ move in the price is required to liquidate a Short trade than a Long trade for a given level of leverage. In this sense Shorting is lower risk."
        },

        Change_PL_USD: {
            name: "Change in Price to Liquidation ($)",
            long: "(entryPrice - rl.Liquidation_Price) * (-1)",
            short: "(entryPrice - rs.Liquidation_Price) * (-1)"
        },

        bankruptcyPrice: {
            long: "entryPrice + (entryPrice * (rl.Change_PB_P / 100))",
            short: "entryPrice + (i.Entry_Price * (rs.Change_PB_P / 100))",
            tooltip: "Bankruptcy Price is the price at which 100% of your margin is used up. This price is not published on the BitMEX site but is stated in your Liquidation Notice email. It differs from the Liquidation Price by the 0.5% Maintenance Margin."
        },

        Change_PB_P: {
            name: "Change in Price to Bankruptcy (%)",
            long: "(1 / (cald.leverage + 1) * (-1)) * 100",
            short: "(1 / (cald.leverage - 1)) * 100"
        },
        Change_PB_USD: {
            name: "Change in Price to Bankruptcy ($)",
            long: "(i.Entry_Price - rl.Bankruptcy_Price) * (-1)",
            short: "(i.Entry_Price - rs.Bankruptcy_Price) * (-1)",
        },
    }
}


function XbtUsdLiq()

    let r = {
        Total_Loss_BTC: {
            name: "Total Loss (BTC)",
            long: "rsm.Initial_Margin + (rsm.Taker_Fees / 2)",
            short: "rsm.Initial_Margin + (rsm.Taker_Fees / 2)",
            tooltip: "This is an ESTIMATE. Check your Total Loss in Realised PNL in Account Balance. The final figure will be affected by Trade fees/ rebates and Funding fees/rebates."
        },
        Total_Loss_USD: {
            long: "rl.Total_Loss_BTC * rl.Liquidation_Price",
            short: "rs.Total_Loss_BTC * rs.Liquidation_Price"
        },
        Payment_IF_BTC: {
            name: "Payment to Insurance Fund (BTC)",
            long: "(rsm.Cost_BTC * rl.Payment_IF_P) * 0.01",
            short: "(rsm.Cost_BTC * rs.Payment_IF_P) * 0.01"
        },
        Payment_IF_USD: {
            name: "Payment to Insurance Fund ($)",
            long: "rl.Payment_IF_BTC * rl.Liquidation_Price",
            short: "rs.Payment_IF_BTC * rs.Liquidation_Price"
        },
        Payment_IF_P: {
            name: "Payment to Insurance Fund <br> (% of Total Loss)",
            long: "(1 - (rl.Change_PL_P / rl.Change_PB_P)) * 100",
            short: "(1 - (rs.Change_PL_P / rs.Change_PB_P)) * 100",
            tooltip: "The higher your leverage the larger the % of Total Loss is paid to the Insurance Fund upon Liquidation. At the maximum 100x leverage 50% of Total Loss is paid to Insurance Fund."
        }
    };


function Calls(){
    let i = {
        Btcusd: 0,
        Btc_entry: 0,
        Expiry: makeDate("fa fa-calendar", "Expiry"),
        Strike: 0,
        Premium: 0,
        Target_Price: 0,
    };

    let r2 = {
        Change_in_btcusd_usd: {
            name: "Change in BTCUSD ($)",
            // i.Target_Price - i.Btc_entry"
        },
        Change_in_btcusd_prc: {
            name: "Change in BTCUSD (%)",
            //  ((i.Target_Price - i.Btc_entry) / i.Btc_entry) * 100"
        },

        Settlement_usd: {
            name: "Settlement ($)",
            long_minZero: true,
            short_maxZero: true,
            long: "i.Target_Price - i.Strike",
            short: "(i.Target_Price - i.Strike) * -1",
            tooltip: "Cash flow that results at Expiry if price of underlying future is at your Target price. But settlement of Deribit (Euopean) Options happens when you close the trade which you may do at ANY time during the Option's lifetime."
        },
        Settlement_btc: {
            name: "Settlement (BTC)",
            long: "rl.Settlement_usd / i.Target_Price",
            short: "rs.Settlement_usd / i.Target_Price"
        },
        Pl_usd: {
            name: "P/L ($)",
            long: "rl.Settlement_usd - r.Premium",
            short: "rs.Settlement_usd + r.Premium"
        },
        Pl_usd_prc: {
            name: "P/L ($) %",
            long: "(rl.Pl_usd / r.Premium) * 100",
            short: "(rs.Pl_usd / r.Premium) * 100"
        },
        Pl_btc: {
            name: "P/L (BTC)",
            long: "rl.Settlement_btc - i.Premium",
            short: "rs.Settlement_btc + i.Premium"
        },
        Pl_bt_prc: {
            name: "P/L (BTC) %",
            long: "(rl.Pl_btc / i.Premium) * 100",
            short: "(rs.Pl_btc / i.Premium) * 100"
        },
        Leverage: {
            name: "Leverage",
            long: "rl.Pl_usd_prc / r.Change_in_btcusd_prc",
            short_inner: "n/a"
        }
    };

    let r3 = {
        Max_gain_btc: {
            name: "MAX Gain (BTC)",
            long: "1 - i.Premium",
            short: "i.Premium"
        },
        Max_gain_usd: {
            name: "MAX Gain ($)",
            long_inner: "Unlimited",
            short: "r.Premium"
        },
        Max_loss_btc: {
            long: "i.Premium",
            short: "1 - i.Premium"
        },
        Max_loss_usd: {
            name: "MAX Loss ($)",
            long: "r.Premium",
            short_inner: "Unlimited",
            tooltip: "The max. loss of writing a single Bitcoin Option in USD is unlimited. New traders should NEVER write or sell options. Restrict all trading to buying Options (& you can sell those you own whenever you like)."
        },
        Initial_margin: {
            name: "Initial Margin (BTC)",
            long_inner: "None",
            short: (e) => {
                    if(e['i.Strike'].val() < e['i.Btc_entry'].val()) return "0.1500";
                    else return "0.1000";
                }
            },
            tooltip: "For Call Option seller, Initial Margin has values:<br>ITM 0.15<br>Close to ATM Between 0.1 and 0.15<br>OTM 0.1"
        }
    };

    let r4 = {
        Break_even_btc: {
            name: "Break-Even in BTC",
            long: "i.Strike / (1 - i.Premium)",
            short: "i.Strike / (1 - i.Premium)"
        },
        Change_be_usd: {
            name: "Change to B/E ($)",
            long: "rl.Break_even_btc - i.Btc_entry",
            short: "rs.Break_even_btc - i.Btc_entry"
        },
        Change_be_prc: {
            name: "Change to B/E (%)",
            long: "(rl.Change_be_usd / i.Btc_entry) * 100",
            short: "(rs.Change_be_usd / i.Btc_entry) * 100"
        },

        Break_even_usd: {
            name: "Break-Even in USD",
            long: "r.Premium + i.Strike",
            short: "r.Premium + i.Strike"
        },
        Change_be_usd2: {
            name: "Change to B/E ($)",
            long: "rl.Break_even_usd - i.Btc_entry",
            short: "rs.Break_even_usd - i.Btc_entry"
        },
        Change_be_prc2: {
            name: "Change to B/E (%)",
            long: "(rl.Change_be_usd2 / i.Btc_entry) * 100",
            short: "(rs.Change_be_usd2 / i.Btc_entry) * 100"
        }
    };


function Puts(){

    let i = {
        Btcusd: makeInput("fa fa-usd", "BTCUSD", "Enter actual Spot Bitcoin price"),
        Btc_entry: makeInput("fa fa-usd", "BTC underlying at entry", "Deribit Bitcoin Options are Options on Futures. Enter the price of the Underlying Future e.g.  BTC-29MAR19"),
        Expiry: makeDate("fa fa-calendar", "Expiry"),
        Strike: makeInput("fa fa-usd", "Strike"),
        Premium: makeInput("fa fa-usd", "Premium (BTC)", "If buying Option then enter the Ask premium. If selling/writing Option enter the Bid premium."),
        Target_Price: makeInput("fa fa-usd", "Target price at expiry", "Target price of underlying Future.")
    };

    let r1 = {
        Premium: {
            name: "PREMIUM ($)",
            // i.Premium * i.Btc_entry",
            tooltip: "This is the most the buyer of the Option can lose, and is the maximum profit of the Option seller."
        },
        itm_otm: {
            name: "ITM/OTM",
            eval: (e) => {
                if(e['i.Strike'].val() < e['i.Btc_entry'].val()) return "Outofthemoney";
                else return "Inthemoney";
            },
            tooltip: "ITM: Put Strike > Underlying price<br/> OTM: Put Strike < Underlying price"
        },
        Intrinsic_usd: {
            name: "Intrinsic value ($)",
            eval: (e) =>    {
                let r = e['i.Strike'].val() - e['i.Btc_entry'].val();
                if(e['i.Btc_entry'].val() !== undefined && e['i.Strike'].val() !== undefined)
                    return r < 0 ? `<small>$</small>0` : `<small>$</small>`+r;
                else return '';
            },
        },
        Intrinsic_btc: {
            name: "Intrinsic value (BTC)",
            // r.Intrinsic_usd / i.Btc_entry"
        },
        Intrinsic_prc: {
            name: "INTRINSIC VALUE (% of premium)",
            // (r.Intrinsic_btc / i.Premium) * 100"
        },
        Non_intrinsic_usd: {
            name: "Non-intrinsic ($) [Time + Volatility]",
            // r.Premium - r.Intrinsic_usd"
        },
        Non_intrinsic_btc: {
            name: "Non-intrinsic (BTC)",
            // i.Premium - r.Intrinsic_btc"
        },
        Non_intrinsic_prc: {
            name: "Non-intrinsic (% of premium)",
            // 100 - r.Intrinsic_prc"
        },
        Days_to_expiry: {
            name: "Days to expiry",
            // i.Expiry"
        }
    }

    let r2 ={
        Change_in_btcusd_usd: {
            name: "Change in BTCUSD ($)",
            // i.Target_Price - i.Btc_entry"
        },
        Change_in_btcusd_prc: {
            name: "Change in BTCUSD (%)",
            //  ((i.Target_Price - i.Btc_entry) / i.Btc_entry) * 100"
        },

        Settlement_usd: {
            name: "Settlement ($)",
            long_minZero: true,
            long: "i.Strike - i.Target_Price",
            short: "(i.Strike - i.Target_Price) * -1",
            tooltip: "Cash flow that results at Expiry if price of underlying future is at your Target price. But settlement of Deribit (Euopean) Options happens when you close the trade which you may do at ANY time during the Option's lifetime."
        },
        Settlement_btc: {
            name: "Settlement (BTC)",
            long: "rl.Settlement_usd / i.Target_Price",
            short: "rs.Settlement_usd / i.Target_Price"
        },
        Pl_usd: {
            name: "P/L ($)",
            long: "rl.Settlement_usd - r.Premium",
            short: "rs.Settlement_usd + r.Premium"
        },
        Pl_usd_prc: {
            name: "P/L ($) %",
            long: "(rl.Pl_usd / r.Premium) * 100",
            short: "(rs.Pl_usd / r.Premium) * 100"
        },
        Pl_btc: {
            name: "P/L (BTC)",
            long: "rl.Settlement_btc - i.Premium",
            short: "rs.Settlement_btc + i.Premium"
        },
        Pl_bt_prc: {
            name: "P/L (BTC) %",
            long: "(rl.Pl_btc / i.Premium) * 100",
            short: "(rs.Pl_btc / i.Premium) * 100"
        },
        Leverage: {
            name: "Leverage",
            long_minZero: true,
            long: "(rl.Pl_usd_prc * -1) / r.Change_in_btcusd_prc",
            short_inner: "n/a"
        }
    };

    let r3 ={
        Max_gain_btc: {
            name: "MAX Gain (BTC)",
            long_inner: "Infinite",
            short: "i.Premium"
        },
        Max_gain_usd: {
            name: "MAX Gain ($)",
            long: "i.Strike - r.Premium",
            short: "r.Premium"
        },
        Max_loss_btc: {
            long: "i.Premium",
            short_inner: "Infinite",
            tooltip: "The max. loss of writing a single Bitcoin Put Option in BTC is unlimited. New traders should NEVER write or sell options. Restrict all trading to buying Options (& you can sell those you own whenever you like)."
        },
        Max_loss_usd: {
            name: "MAX Loss ($)",
            long: "r.Premium",
            short: "i.Strike - r.Premium"
        },
        Initial_margin: {
            name: "Initial Margin (BTC)",
            short: (e) => {
                if(e['i.Strike'].val() > e['i.Btc_entry'].val()) return "0.1500";
                else return "0.1000";
            },
            tooltip: "For Put Option seller, Initial Margin has values:<br>ITM 0.15<br>Very close to ATM Between 0.1 and 0.15<br>OTM Between 0 and 0.1"
        }
    };

    let r4 = {
        Break_even_btc: {
            name: "Break-Even in BTC",
            long: "i.Strike / (1 + i.Premium)",
            short: "i.Strike / (1 + i.Premium)"
        },
        Change_be_usd: {
            name: "Change to B/E ($)",
            long: "rl.Break_even_btc - i.Btc_entry",
            short: "rs.Break_even_btc - i.Btc_entry"
        },
        Change_be_prc: {
            name: "Change to B/E (%)",
            long: "(rl.Change_be_usd / i.Btc_entry) * 100",
            short: "(rs.Change_be_usd / i.Btc_entry) * 100"
       },

        Break_even_usd: {
            name: "Break-Even in USD",
            long: "i.Strike - r.Premium",
            short: "i.Strike - r.Premium"
        },
        Change_be_usd2: {
            name: "Change to B/E ($)",
            long: "rl.Break_even_usd - i.Btc_entry",
            short: "rs.Break_even_usd - i.Btc_entry"
        },
        Change_be_prc2: {
            name: "Change to B/E (%)",
            long: "(rl.Change_be_usd2 / i.Btc_entry) * 100",
            short: "(rs.Change_be_usd2 / i.Btc_entry) * 100"
        }
    };

