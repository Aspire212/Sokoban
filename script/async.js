'use strict';

const cmd = {
    c: 'INSERT',
    r: 'READ',
    u: 'UPDATE',
    l: 'LOCKGET',
    pass: 'ret5',
    name: 'ST_TEST_234170',
    url: 'https://fe.it-academy.by/AjaxStringStorage2.php',

    urlParams(f, n, p, v) {
        let param = {}
        param.f = f
        param.n = n
        if (p) param.p = p
        if (v) param.v = v
        return {
            method: 'post',
            body: new URLSearchParams(param)
        }
    },

    async fetchData(url, param) {
        try {
            let response = await fetch(url, param);
            let data = await response.json()
            return data
        } catch (err) {
            console.error(err)
        }
    },

    sortObj(obj) {
        let newObj = {}
        let sortNum = Object.values(obj).sort((a, b) => b - a);
        sortNum.forEach(el => {
            Object.keys(obj).forEach(key =>
                obj[key] === el ? newObj[key] = el : false)
        })
        return newObj
    }
}

/*------set new data-------------------*/

async function setData({
    c,
    r,
    u,
    l,
    name,
    url,
    pass,
    urlParams,
    fetchData,
    sortObj
}, playerData) {

    try {
        let serverData = await fetchData(url, urlParams(r, name))
        let newParam;
        let answer;
        let addNewData;
        if (!serverData.result) {
            newParam = urlParams(l, name, pass)
            answer = await fetchData(url, newParam)
            newParam = urlParams(u, name, pass, JSON.stringify(playerData))
            addNewData = await fetchData(url, newParam)
        } else {
            console.log(serverData)
            serverData = JSON.parse(serverData.result)

            newParam = urlParams(l, name, pass)
            answer = await fetchData(url, newParam)

            playerData = sortObj({...serverData,
                ...playerData
            })
            newParam = urlParams(u, name, pass, JSON.stringify(playerData))
            addNewData = await fetchData(url, newParam)
        }


    } catch (err) {
        console.error(err)
    }
}


/*get function */

async function getAndCreate(par, foo) {
    let response = await fetch(cmd.url, cmd.urlParams('READ', cmd.name));
    let answer = await response.json();
    answer = JSON.parse(answer.result);
    Object.keys(answer).forEach((key, i) => {
        par.append(foo(key, i, answer[key]))
    })
}