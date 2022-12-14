function maketoken(length) {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

console.log("maketoken(15) = ",maketoken(15));

function deleteFiles(){
  const fs = require('fs');
  
  var folder = './images/';
     
  fs.readdir(folder, (err, files) => {
    if (err) throw err;
    
    for (const file of files) {
        console.log(file + ' : File Deleted Successfully.');
        fs.unlinkSync(folder+file);
    }
    
  });
}

module.exports = {maketoken,deleteFiles};