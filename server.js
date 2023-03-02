const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({extended:true}));

const port = process.env.PORT || 3000;

app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,'index.html'));
})

app.get('/readjson',(req,res)=>{
    const jsonData = JSON.parse(fs.readFileSync('./data.json'));  
    res.json(jsonData);
})


app.post('/bookmark', (req,res)=>{
    let message = {}
    try {
        const index = req.body.index;
        const jsonData = JSON.parse(fs.readFileSync('./data.json'));
        jsonData[index].isBookmarked = !jsonData[index].isBookmarked;
        let flag = jsonData[index].isBookmarked;
        fs.writeFileSync('./data.json', JSON.stringify(jsonData));
        if (flag){
            message.text = 'added to bookmark';  
        } else{
            message.text = 'removed from bookmarks'
        }
        message.flag = flag;
        res.json(message);
    } catch (error) {
        message.text = 'internal server error happened';
        res.json(message);
    }
});



app.listen(port , ()=>{
    console.log(`server is runnig on port : ${port}`);
});






