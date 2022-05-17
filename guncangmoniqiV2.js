//滚仓模拟器
//滚仓原理，比如开多，每赚1%，就拿赚的这1%开仓合约
//或者开空，每跌1%，就拿这赚的1%继续开空

//网格基础类
class Heyue {
    //构造函数
    constructor(nCoinNumber, price, c_rate, openprice, blong) {
        this.nCoinNumber = nCoinNumber;//每格开多少张的合约
        this.price = price;
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

        if (this.blong == true) {
            this.nLost = (this.price - nowprice) * this.nCoinNumber + this.nCoinNumber * this.price * this.c_rate;
            return 0 - this.nLost;
        }
        else {
            this.nLost = (nowprice - this.price) * this.nCoinNumber + this.nCoinNumber * this.price * this.c_rate;
            return 0 - this.nLost;
        }

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

    openprice = 100.0;
    guicangbili = 0.1;
    leverage = 1;
    usdnumber = 10000;
    //useusdnumber = 10000;
    c_rate = 2 / 10000;

    stopprice = 0.001;
    minCoinNumber = 1;
    minxiaoshudian = 0;
    // 0 等比，1等差
    addtype = 0;

    //以下参数不用填
    guncangtype = 2;
    guncangprice = 0;
    heyuepiao = null
    //1做多，2做空
    if (openprice < stopprice) {
        guncangtype = 1;
        guncangprice = ((stopprice - openprice) * guicangbili)
        heyuepiao = new Heyue(0, 0, c_rate, openprice, true);

    }
    else {
        guncangtype = 2;
        guncangprice = ((openprice - stopprice) * guicangbili)
        heyuepiao = new Heyue(0, 0, c_rate, openprice, false);
    }


    var diyifenzijin = usdnumber

    nowprice = openprice;
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


            var dangqianyingli = win + useusdnumber;
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

            var dangqianyingli = win + useusdnumber;
            if (dangqianyingli < 0) {
                return nowprice;


            }

            nowprice = nowprice + 0.0001;
        }

    }
}