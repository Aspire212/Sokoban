'use strict';

function actionRequest(obj, getOrSet = true) {
    const url = 'https://fe.it-academy.by/AjaxStringStorage2.php'
    const pass = 'ret5'
    const name = 'ST_TEST_234158'
    const comandF = {
        change: 'INSERT',
        read: 'READ',
        update: 'UPDATE',
        lock: 'LOCKGET',
    }
    if (getOrSet) {
        //прперяю данные на сервере
        fetchInfo(url, {
                f: comandF.read,
                n: name
            })
            .then(resp => resp.json())
            .then(data => {
                if (!data.result) {
                    fetchInfo(url, {
                            f: comandF.lock,
                            n: name,
                            p: pass
                        })
                        .then(resp => resp.json())
                        .then(data => {
                            console.log(data)
                            fetchInfo(url, {
                                f: comandF.update,
                                n: name,
                                p: pass,
                                v: JSON.stringify(obj)
                            })
                        })
                        .catch(err => console.log(err, 'pusto'))
                } else {
                    let tempObj = JSON.parse(data.result);
                    fetchInfo(url, {
                            f: comandF.lock,
                            n: name,
                            p: pass
                        })
                        .then(resp => resp.json())
                        .then(data => {
                            fetchInfo(url, {
                                f: comandF.update,
                                n: name,
                                p: pass,
                                v: JSON.stringify({...tempObj,
                                    ...obj
                                })
                            })
                        })
                        .catch(err => console.log(err, 'nepusto'))
                }
            })
            .catch(err => console.log(err, 'allCath'))
    } else {
        fetchInfo(url, {
                f: comandF.read,
                n: name
            })
            .then(resp => resp.json())
            .then(data => console.log(JSON.parse(data.result)))
            .catch(err => console.log(err))
    }
}

function fetchInfo(u, par) {
    return fetch(u, {
        method: 'post',
        body: new URLSearchParams(par),
    })
}


function urlParams(f, n, p, v) {
    let param = {};
    param.f = f;
    param.n = n;
    if (p) param.p = p;
    if (v) param.v = v;
    return {
        method: 'post',
        body: new URLSearchParams(param)
    };
}