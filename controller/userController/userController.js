exports.getHomePage = (req, res) => {
    res.render('CustomerView/Home', {
        title: 'Home Page',
        message: 'Welcome to the Home Page!'
    });
}

exports.getMenuPage = (req, res) => {   
    res.render('CustomerView/Menu', {
        title: 'Menu Page',
        message: 'Welcome to the Menu Page!'
    });
}
