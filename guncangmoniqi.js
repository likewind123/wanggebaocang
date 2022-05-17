//滚仓模拟器
//滚仓原理，比如开多，每赚1%，就拿赚的这1%开仓合约
//或者开空，每跌1%，就拿这赚的1%继续开空

//网格基础类
class Grid {
    //构造函数
    constructor(nCoinNumber, price, c_rate, openprice, bchuangjian = false, blong = false) {
        this.nCoinNumber = nCoinNumber;//每格开多少张的合约
        this.price = price;
        this.c_rate = c_rate;
        this.openprice = openprice;
        if (price < openprice) {
            this.blong = true;
        }
        else {
            this.blong = false;
        }
        //判断是不是开仓之前就创建了,用于做多和做空网格
        this.bchuangjian = bchuangjian;
        if (bchuangjian) {
            this.blong = blong;
        }
    }

    //获得网格当前占用保证金
    Getbaozhengjin(nowprice) {
        return this.nCoinNumber * openprice;
    }


    Getlost(nowprice) {
        if (this.bchuangjian == false) {
            //这个是给中性网格用的，别直接用
            if (this.blong == true) {
                if (nowprice > this.price) {
                    this.nLost = 0;
                    return 0;
                }
                this.nLost = (this.price - nowprice) * this.nCoinNumber + this.nCoinNumber * this.price * this.c_rate;
                return this.nLost;
            }
            else {
                if (nowprice < this.price) {
                    this.nLost = 0;
                    return 0;
                }
                this.nLost = (nowprice - this.price) * this.nCoinNumber + this.nCoinNumber * this.price * this.c_rate;
                return this.nLost;
            }
        }
        else {
            //这个是给中性网格的开多或者开空网格用的
            if (this.blong == true) {
                //开多的时候
                this.nLost = (this.price - nowprice) * this.nCoinNumber + this.nCoinNumber * this.price * this.c_rate;
                return this.nLost;
            }
            else {
                //开空的时候
                this.nLost = (nowprice - this.price) * this.nCoinNumber + this.nCoinNumber * this.price * this.c_rate;
                return this.nLost;
            }
        }
    }


    Getwin(nowprice) {
        if (this.bchuangjian == false) {

        }
        else {
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
}

heyuejisuan();
var GridList = []
function heyuejisuan() {
    GridList = []
    openprice = 100.0;
    guicangbili = 0.1;
    leverage = 1;
    usdnumber = 10000;
    //useusdnumber = 10000;
    c_rate = 2 / 10000;

    stopprice = 0.001;
    minCoinNumber = 1;
    minxiaoshudian = 0;

    //以下参数不用填
    guncangtype = 2;
    guncangprice = 0;
    //1做多，2做空
    if (openprice < stopprice) {
        guncangtype = 1;
        guncangprice = ((stopprice - openprice) * guicangbili)

    }
    else {
        guncangtype = 2;
        guncangprice = ((openprice - stopprice) * guicangbili)
    }


    var diyifenzijin = usdnumber 

    nowprice = openprice;
    //开始滚仓
    while (true) {
        //计算花了多少保证金
        var baozhengjin = 0;
        var win = 0;
        for (var i = 0; i < GridList.length; i++) {
            baozhengjin = baozhengjin + GridList[i].Getbaozhengjin(nowprice);
            win = win + GridList[i].Getwin(nowprice);
        }
        var keshiyongzijin = (diyifenzijin  + win) * leverage;
        diyifenzijin = 0;
        var nCoinNumber = (keshiyongzijin / nowprice);
        if (nCoinNumber < minCoinNumber) {
            console.log("保证金太少，无法开合约");

        }
        else {
            nCoinNumber = nCoinNumber.toFixed(minxiaoshudian)
            //开始计算创建合约
            if (guncangtype == 1) {
                var grid = new Grid(nCoinNumber, nowprice, c_rate, nowprice, true, true);
                GridList.push(grid);

            }
            else {
                var grid = new Grid(nCoinNumber, nowprice, c_rate, nowprice, true, false);
                GridList.push(grid);
            }
        }
        // 计算合约爆仓价
        var totalzijin = usdnumber ;
        var baocangjia = calcjisuanjiage(nowprice,guncangtype, totalzijin,usdnumber * leverage);
        console.log("当前开仓价：" + nowprice +"    当前盈利:" + win  +"    盈利比："+(win*100/usdnumber).toFixed(2) +"%" +"    当前爆仓价：" + baocangjia) ;
        if (guncangtype == 1) {
            if (nowprice > stopprice) {
                break;
            }
            else {
                nowprice = nowprice*(1 + guicangbili)
            }
        }
        else {
            if (nowprice < stopprice) {
                break;
            }
            else {
                nowprice = nowprice *(1 - guicangbili)
            }
        }
    }
}


function calcjisuanjiage(openprice,gridtype,useusdnumber,chushizijin) {
    //合约爆仓价
    
    if (gridtype ==1 ) {
        //做多合约
        
        nowprice = openprice;
        while (nowprice > 0) {
            var los = 0;
            var baozhengjin = 0;
            var win = 0
            for (i = 0; i < GridList.length; i++) {
                baozhengjin = baozhengjin + GridList[i].Getbaozhengjin(nowprice);
                win = win + GridList[i].Getwin(nowprice);
                los = los + GridList[i].Getlost(nowprice);
            }
            var dangqianyingli =win +useusdnumber;
            if (dangqianyingli < 0) {
                return  nowprice ;

               
            }
            
            nowprice = nowprice - 0.01;
        }
        
    }
    else {
        //开空合约
       
        var nowprice = openprice;
        while (nowprice > 0) {
            var los = 0;
            var baozhengjin = 0;
            var win = 0
            for (i = 0; i < GridList.length; i++) {
                baozhengjin = baozhengjin + GridList[i].Getbaozhengjin(nowprice);
                win = win + GridList[i].Getwin(nowprice);
                los = los + GridList[i].Getlost(nowprice);
            }
            var dangqianyingli = win +useusdnumber;
            if (dangqianyingli < 0) {
                return  nowprice ;

               
            }
            
            nowprice = nowprice + 0.0001;
        }
        
    }
}