module.exports = {
    pagination: pagination,
    repagination:repagination
};
///////////////////////////////////////////

/**
 *
 * @param p
 * @param data
 * @returns {{}}
 */

function pagination(p,data){

    var pagination = {};

    var params = {
        page_size:10,
        page:1,
    }

    params = extendCopy(p);

    var last_page = Math.ceil(data.length / params.page_size);


    pagination = {
        "per_page": params.page_size,
        "current_page": params.page,
        "last_page": last_page,
        "total":data.length,
        "data":data.slice((params.page - 1) * params.page_size,params.page * params.page_size)
    }

    return pagination;
}


function repagination(p,data){
    var pagination = {};

    var params = {
        page_size:10,
        page:1,
    }

    params = extendCopy(p);

    var last_page = Math.ceil(data.length / params.page_size);


    pagination = {
        "per_page": params.page_size,
        "current_page": params.page,
        "last_page": last_page,
        "total":data.length,
        "data":data.reverse().slice((params.page - 1) * params.page_size,params.page * params.page_size).reverse()
    }

    return pagination;
}

/**
 * 浅拷贝
 * @param p
 * @returns {{}}
 */
function extendCopy(p){
    var c = {};
    for(var i in p){
        c[i] = p[i];
    }
    c.uber = p;
    return c;
}