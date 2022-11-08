//滚仓模拟器
//滚仓原理，比如开多，每赚1%，就拿赚的这1%开仓合约
//或者开空，每跌1%，就拿这赚的1%继续开空

//网格基础类
class Heyue {
    //构造函数
    constructor(nCoinNumber, price, c_rate, openprice, leverage,blong) {
        this.nCoinNumber = nCoinNumber;//每格开多少张的合约
        this.price = price;
        this.leverage = leverage;
        //资金费率
        this.c_rate = c_rate;
        this.openprice = openprice;

        this.blong = blong;

    }

    AddPiao(nCoinNumber, price, blong = false) {
        nCoinNumber = Number(nCoinNumber);
        if (this.blong == blong) {
            var allprice = this.price * this.nCoinNumber + nCoinNumber * price;
            this.nCoinNumber = this.nCoinNumber + nCoinNumber;
            this.price = allprice / this.nCoinNumber;
        }
        else {
            var allprice = this.price * this.nCoinNumber - nCoinNumber * price;
            this.nCoinNumber = this.nCoinNumber - nCoinNumber;
            this.price = allprice / this.nCoinNumber;
        }
    }

    Getwin(nowprice) {
        //多单
        // 如果 1刀，开了1000张，涨到2刀
        // nowprice - this.price = 1刀，赚了 1000U
        // 币从 1000刀，涨到了2000刀，持仓
        // 所以总共赚了 
        if (this.blong == true) {
            this.nLost = (this.price - nowprice) * this.nCoinNumber + this.nCoinNumber * this.price * this.c_rate;
            return 0 - this.nLost;
        }
        else {
            this.nLost = (nowprice - this.price) * this.nCoinNumber + this.nCoinNumber * this.price * this.c_rate;
            return 0 - this.nLost;
        }

    }

    GetNowUSD(nowprice)
    {
        return this.nCoinNumber*nowprice/this.leverage*(1-0.0251*this.leverage);
    }
}

heyuejisuan();

//开仓价格
//滚仓比例
//杠杆水平
//保证金
//手续费
//结束价格
//单张合约最小数量
//小数点位数
//等差还是等比
function heyuejisuan() {


    var openprice = 330.0;
    var guicangbili = 0.1;
    var leverage = 20;
    var usdnumber = 330;
    //useusdnumber = 10000;
    var c_rate = 2 / 10000;

    var stopprice = 0.001;
    var minCoinNumber = 1;
    var minxiaoshudian = 0;
    // 0 等比，1等差
    var addtype = 0;

    //以下参数不用填
    var guncangtype = 2;
    var guncangprice = 0;
    var heyuepiao = null
    //1做多，2做空
    if (openprice < stopprice) {
        guncangtype = 1;
        guncangprice = ((stopprice - openprice) * guicangbili)
        heyuepiao = new Heyue(0, 0, c_rate, openprice,leverage, true);

    }
    else {
        guncangtype = 2;
        guncangprice = ((openprice - stopprice) * guicangbili)
        heyuepiao = new Heyue(0, 0, c_rate, openprice,leverage, false);
    }


    var diyifenzijin = usdnumber

    var nowprice = openprice;
    //开始滚仓
    while (nowprice>0) {
        //计算花了多少保证金
        var baozhengjin = 0;
        var win = heyuepiao.Getwin(nowprice);

        var keshiyongzijin = (diyifenzijin + win) * leverage;
        diyifenzijin = 0;
        var nCoinNumber = (keshiyongzijin / nowprice);
        if (nCoinNumber < minCoinNumber) {
            console.log("保证金太少，无法开合约");

        }
        else {
            nCoinNumber = nCoinNumber.toFixed(minxiaoshudian)
            //开始计算创建合约
            if (guncangtype == 1) {
                heyuepiao.AddPiao(nCoinNumber, nowprice, true);


            }
            else {
                heyuepiao.AddPiao(nCoinNumber, nowprice, false);

            }
        }
        // 计算合约爆仓价
        var totalzijin = usdnumber + win;
        var baocangjia = calcjisuanjiage(heyuepiao, nowprice, guncangtype, totalzijin);
        console.log("持仓价格:" + heyuepiao.price + "    当前持仓张数:" + heyuepiao.nCoinNumber + "    当前价格：" + nowprice + "    当前盈利:" + win + "    盈利比：" + (win * 100 / usdnumber).toFixed(2) + "%" + "    当前爆仓价：" + baocangjia);
        if (guncangtype == 1) {
            if (nowprice > stopprice) {
                break;
            }
            else {
                if (addtype == 0) {
                    nowprice = nowprice * (1 + guicangbili)
                }

                else {
                    nowprice = nowprice + guncangprice;
                }
            }
        }
        else {
            if (nowprice < stopprice) {
                break;
            }
            else {

                if (addtype == 0) {
                    nowprice = nowprice * (1 - guicangbili)
                }
                else {
                    nowprice = nowprice - guncangprice;
                }
            }
        }
    }
}


function calcjisuanjiage(piao, openprice, gridtype, useusdnumber) {
    //合约爆仓价
    console.log("可以用保证金为：" + useusdnumber)
    if (gridtype == 1) {
        //做多合约

        nowprice = openprice;
        while (nowprice > 0) {

            var win = piao.Getwin(nowprice)
            var usd = piao.GetNowUSD(nowprice)
           

            var dangqianyingli = win + usd;
            if (dangqianyingli < 0) {

                return nowprice;


            }

            nowprice = nowprice - 0.01;
        }
        return 0;

    }
    else {
        //开空合约

        var nowprice = openprice;
        while (nowprice > 0) {

            var win = piao.Getwin(nowprice);

            var usd = piao.GetNowUSD(nowprice)
            if(nowprice > 338)
            {
                nowprice = nowprice;
            }

            var dangqianyingli = win + usd;
            if (dangqianyingli < 0) {
                return nowprice;


            }
            if(nowprice>200000)
            {
                return 999999999
            }

            nowprice = nowprice + 0.01;
        }

    }
}