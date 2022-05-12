//网格类，用于计算该网格的在某个价格下亏损多少钱

var GridList = []
function wanggejisuan() {
    GridList = []
    openprice = 2.0;
    pricelow = 1.2;
    pricehigh = 3.6;
    gridnumber = 100;
    leverage = 20;
    usdnumber = 10000;
    useusdnumber = 20000;
    c_rate = 2 / 10000;
    minCoinNumber = 1;
    minxiaoshudian = 0;
    mubiaojiage =  1;
    // 网格类型 0 中性，1做多，2做空
    gridtype = 2;
    CreateGrid(openprice, pricelow, pricehigh, gridnumber, leverage, usdnumber, useusdnumber, c_rate, minCoinNumber, minxiaoshudian,gridtype);
    //计算价格跌到0时会不会爆仓
    calcjisuanjiage(openprice, pricelow, pricehigh, gridnumber, leverage, usdnumber, useusdnumber, c_rate, minCoinNumber, minxiaoshudian, mubiaojiage,gridtype)
    // 计算价格涨上天的时候会不会爆仓

    mubiaojiage = 100
    calcjisuanjiage(openprice, pricelow, pricehigh, gridnumber, leverage, usdnumber, useusdnumber, c_rate, minCoinNumber, minxiaoshudian, mubiaojiage,gridtype)
    // 计算价格涨上天的时候会不会爆仓
}

class Grid {
    //构造函数
    constructor(nCoinNumber, price, c_rate, openprice,bchuangjian = false,blong = false) {
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
        if(bchuangjian)
        {
            this.blong = blong;
        }
    }
    //类中函数
    Getlost(nowprice) {
        if(this.bchuangjian==false)
        {
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
        else
        {
            if (this.blong == true) {
                this.nLost = (this.price - nowprice) * this.nCoinNumber + this.nCoinNumber * this.price * this.c_rate;
                return this.nLost;
            }
            else{
                this.nLost = (nowprice - this.price) * this.nCoinNumber + this.nCoinNumber * this.price * this.c_rate;
                return this.nLost;
            }
        }
        
    }
}

/*参数
 *开仓价格 openprice
 *网格上限 pricelow
 *网格下限 pricehigh
 *网格数量 gridnumber
 *杠杆倍数 leverage
 *开仓投入U数量  usdnumber
 *保证金数量 useusdnumber 可以决定补仓，比如初始投入1万U，我后面快爆了又投入1万U，这个时候就有2万U的保证金
 *等差等比网格  暂时只支持等差网格
 *最小开仓张数 minCoinNumber
 *最小开仓张数有几位小数 minxiaoshudian
 *手续费 c_rate
 */



function calcjisuanjiage(openprice, pricelow, pricehigh, gridnumber, leverage, usdnumber, useusdnumber, c_rate, minCoinNumber, minxiaoshudian, mubiaojiage,gridtype) {
    var wanggename = "中性网格";
    if(gridtype == 1)
    {
        wanggename = "做多网格";
    }
    else if(gridtype == 2)
    {
        wanggename = "做空网格";
    }
    //到达目标价或者爆仓是结果是什么
    if (mubiaojiage > openprice) {
        console.log("------------------------------------------------------");
        nowprice = openprice;
        while (nowprice > 0) {
            var los = 0;
            for (i = 0; i < GridList.length; i++) {
                var grid = GridList[i];
                los = los + grid.Getlost(nowprice);
            }
            if (los > useusdnumber) {
                
                console.log("开仓信息:" + wanggename);
                console.log("开仓价格:" + openprice);

                console.log("网格最低价：" + pricelow);

                console.log("网格最高价：" + pricehigh);

                console.log("网格数量：" + gridnumber);

                console.log("网格杠杆：" + leverage + "x");

                console.log("网格开仓金额" + usdnumber + "usd");

                console.log("网格保证金金额" + useusdnumber + "usd");

                console.log("当价格大于" + nowprice + "时，爆仓");

                break;
            }
            else if(mubiaojiage < nowprice)
            {
                console.log("开仓信息:" + wanggename);
                console.log("开仓价格:" + openprice);

                console.log("网格最低价：" + pricelow);

                console.log("网格最高价：" + pricehigh);

                console.log("网格数量：" + gridnumber);

                console.log("网格杠杆：" + leverage + "x");

                console.log("网格开仓金额" + usdnumber + "usd");

                console.log("网格保证金金额" + useusdnumber + "usd");

                if(los>0)
                {
                    console.log("当单边行情价格为:" + mubiaojiage);
                    console.log("单边给定价格亏损" + los+"usd");
                    console.log("单边给定价格亏损百分比" + (los*100/useusdnumber).toFixed(2) +"%");
                }
                else
                {
                    los = 0-los
                    console.log("目标价是:" + mubiaojiage);
                    console.log("网格赚：" + los+"usd");
                    console.log("到达目标价格时赚钱百分比：" + (los*100/useusdnumber).toFixed(2) +"%");
                }
                

                break;
            }
            nowprice = nowprice + 0.01;
        }
        console.log("------------------------------------------------------");
    }
    else {
        console.log("------------------------------------------------------");
        var nowprice = openprice;
        while (nowprice > 0) {
            var los = 0;
            for (i = 0; i < GridList.length; i++) {
                var grid = GridList[i];
                los = los + grid.Getlost(nowprice);
            }
            if (los > useusdnumber) {
                console.log("开仓信息:" + wanggename);
                console.log("开仓价格:" + openprice);

                console.log("网格最低价：" + pricelow);

                console.log("网格最高价：" + pricehigh);

                console.log("网格数量：" + gridnumber);

                console.log("网格杠杆：" + leverage + "x");

                console.log("网格开仓金额" + usdnumber + "usd");

                console.log("网格保证金金额" + useusdnumber + "usd");

                console.log("当价格低于" + nowprice + "时，爆仓");

                break;
            }
            else if(mubiaojiage > nowprice)
            {
                console.log("开仓信息:" + wanggename);
                console.log("开仓价格:" + openprice);

                console.log("网格最低价：" + pricelow);

                console.log("网格最高价：" + pricehigh);

                console.log("网格数量：" + gridnumber);

                console.log("网格杠杆：" + leverage + "x");

                console.log("网格开仓金额" + usdnumber + "usd");

                console.log("网格保证金金额" + useusdnumber + "usd");

                if(los>0)
                {
                    console.log("当单边行情价格为:" + mubiaojiage);
                    console.log("单边给定价格亏损" + los+"usd");
                    console.log("单边给定价格亏损百分比" + (los*100/useusdnumber).toFixed(2) +"%");
                }
                else
                {
                    los = 0-los
                    console.log("目标价是:" + mubiaojiage);
                    console.log("网格赚：" + los+"usd");
                    console.log("到达目标价格时赚钱百分比：" + (los*100/useusdnumber).toFixed(2) +"%");
                }

                break;
            }
            nowprice = nowprice - 0.0001;
        }
        console.log("------------------------------------------------------");
    }
}


//这里暂时用的小币种，最小开一张合约这种。如果比特币之类的要调整
//实际计算代码
function CreateGrid(openprice, pricelow, pricehigh, gridnumber, leverage, usdnumber, useusdnumber, c_rate, minCoinNumber, minxiaoshudian,gridtype) {

    var nprice = (pricehigh - pricelow) / gridnumber;
    nprice = nprice.toFixed(4)
    var ewaigrid = 0;
    var zuoduowangge =  parseInt((pricehigh - openprice) / nprice);
    var zuokongwangge = parseInt((openprice - pricelow) / nprice);
    
    
    if(gridtype == 1)
    {
        ewaigrid = zuoduowangge;
    }
    else if(gridtype == 2)
    {
        ewaigrid = zuokongwangge;
    }

    

    //计算资金能开多少网格
    var nCoinNumber = (leverage * usdnumber / (gridnumber * openprice+ ewaigrid*openprice));
    if (nCoinNumber < minCoinNumber) {
        console.log("保证金太少，无法开网格");
    }
    nCoinNumber = nCoinNumber.toFixed(minxiaoshudian)
    //开仓的时候靠近网格的一格不开
    var nmid = parseInt((openprice - pricelow) / nprice);

    var lowmid = openprice - pricelow - nmid * nprice;
    var highmid = pricelow + (nmid + 1) * nprice - openprice;

    var missmid = nmid;
    if (highmid < lowmid) {
        missmid = nmid + 1;
    }


    for (i = 0; i < gridnumber + 1; i++) {
        if (i == missmid) {
            continue;
        }
        var grid = new Grid(nCoinNumber, pricelow + i * nprice, c_rate, openprice,false,false);
        GridList.push(grid);
    }

    if(gridtype == 1)
    {
        //做多网格
        
        for(i=0;i<ewaigrid;i++)
        {
            var grid = new Grid(nCoinNumber, openprice, c_rate, openprice,true,true);
            GridList.push(grid);
        }
    }
    else if(gridtype == 2)
    {
        for(i=0;i<ewaigrid;i++)
        {
            var grid = new Grid(nCoinNumber, openprice, c_rate, openprice,true,false);
            GridList.push(grid);
        }
    }

    return true;
}


wanggejisuan()