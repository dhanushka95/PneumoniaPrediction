exports.prediction = (req, res, next) => {
    res.status(200).json({
        data: req.headers.PredictData,
        message: 'No Entries Found'
    });

};
