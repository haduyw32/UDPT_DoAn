function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length,c.length);
        }
    }
    return "";
}

function checkCookie() {
            _id=getCookie("c_id");
            pass=getCookie("cpass");
            if (_id!="" && pass!="") {
                return true;
            } else {
               return false;
            }
        }
        if (checkCookie() == false) {
            window.location.href="/login";
}