exports.home = (req, res) => {
    res.render('./main/index')
}

exports.contact = (req, res) => {
    res.render('./main/contact_us')
}

exports.aboutUs = (req, res) => {
    res.render('./main/about')
}

exports.error = (req, res) => {
    res.render('./main/error')
}