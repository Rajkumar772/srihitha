exports.saveopfinalpatntBillCtrl = function (req, res) {
  appmdl.GetOPpatientFinallBillmdl(req.body, function (err, results) {
    if (results.length !== 0) {
      appmdl.OPUpdateFnlBillmdl(results[0], req.body, function (err, results) {
        if (err) {
          res.send({ 'status': 500, 'data': results });
          return;
        }
        res.send({ 'status': 200, 'data': results });
      });
    }
    else {
      res.send({ 'status': 500, 'data': results });
    }
  });
}