exports.getHomePage = (req, res) => {
    res.render('CustomerView/Home', {
        title: 'Home Page',
        isLoggedIn:req.session.isLoggedIn,
        user:req.session.user
    });
}

exports.getMenuPage = (req, res) => {   
    res.render('CustomerView/Menu', {
        title: 'Menu Page',
        isLoggedIn:false,
        user:req.session.user
    });
}
