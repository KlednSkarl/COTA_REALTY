require('dotenv').config();
const { log } = require('console');
const express = require('express');
const app = express();
const sql = require('mssql');
const API_KEY = process.env.API_KEY;
app.use(express.json());
app.use((req,res,next)=>{
const clientKey = req.headers['x-api-key'];
    console.log('Received x-api-key:', clientKey);
    console.log('Loaded API_KEY:', API_KEY);
if (clientKey!== API_KEY){
 
    return res.status(403).send("Forbidden: API key invalid");
}
next();

});
const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    port: parseInt(process.env.DB_PORT),
    database: process.env.DB_DATABASE,
    options: {
        encrypt: false,
        trustServerCertificate: true
    }
};

app.get('/tbl', async (req, res) => {
    try {
        const pool = await sql.connect(config);
        const result = await pool.request().query('SELECT * FROM H_tblPhase');
        res.json(result.recordset);
         
    } catch (err) {
        console.error(err);
        res.status(500).send('Database Error');
    }
});

app.get('/tbl', async (req, res) => {
    try {
        const pool = await sql.connect(config);
        const result = await pool.request().query('SELECT * FROM H_tblPhase');
        res.json(result.recordset);
         
    } catch (err) {
        console.error(err);
        res.status(500).send('Database Error');
    }
});

app.get('/Area', async (req, res) => {
    try {
        const pool = await sql.connect(config);
        const result = await pool.request().query('SELECT * FROM H_tblArea');
        res.json(result.recordset);
         
    } catch (err) {
        console.error(err);
        res.status(500).send('Database Error');
    }
});

app.get('/Subd', async (req, res) => {
    try {
        const pool = await sql.connect(config);
        const result = await pool.request().query('SELECT * FROM H_tblSubd');
        res.json(result.recordset);
         
    } catch (err) {
        console.error(err);
        res.status(500).send('Database Error');
    }
});

app.get('/Subd', async (req, res) => {
    try {
        const pool = await sql.connect(config);
        const result = await pool.request().query('SELECT * FROM H_tblSubd');
        res.json(result.recordset);
         
    } catch (err) {
        console.error(err);
        res.status(500).send('Database Error');
    }
});


app.get('/ClientFiltered', async (req,res) =>{
       const {Are, Subd, Phase } = req.query;

        try{
            const pool = await sql.connect(config);
            const result = await pool.request()
            .input('Are', sql.VarChar(30),Are)
            .input('Subd', sql.VarChar(30),Subd)
            .input('Phase',sql.VarChar(30),Phase)
            .execute('H_FilterClient');
            res.json(result.recordset);
        }
            catch (err) {
            console.error(err);
            res.status(500).send('Database Error');
            }
});

app.get('/PrevRead', async (req,res) =>{
        const{WMNo} = req.query;

        try{
            const pool = await sql.connect(config);
            const result = await pool.request()
            .execute('H_tblWMeterDescr');
            res.json(result.recordset);
        }
        catch (err) {
            console.error(err);
            res.status(500).send('Database Error');
        }

}); // previous reading 








app.post('/ImportedFromLocalPrevRead',async (req,res)=> {
    const {WMNo,PR_Type,MStat,PrevMRead,PrevDteRead,CurMRead,CurDteRead,CBUsed,DueDte,dteDC,CAmt,RefLine,UserID} = req.body;

    try{
            await sql.connect(config);
            const request = new sql.Request();
            
            request.input('WMNo',sql.VarChar(20),WMNo);
            request.input('PRType',sql.VarChar(20),PR_Type);
            request.input('MStat', sql.VarChar(20),MStat);
            request.input('PrevMRead',sql.BigInt,PrevMRead);
            request.input('PrevDteRead',sql.DateTime,PrevDteRead);
            request.input('CurMRead',sql.BigInt,CurMRead);
            request.input('CurDteRead',sql.DateTime,CurDteRead);
            request.input('CBUsed',sql.BigInt,CBUsed);
            request.input('DueDte',sql.DateTime,DueDte);
            request.input('dteDC',sql.DateTime,dteDC);
            request.input('CAmt',sql.BigInt,CAmt);
            request.input('RefLine',sql.BigInt,RefLine);
            request.input('UserID',sql.VarChar(20),UserID);
            await request.execute('[H_InsertToPrevReadFromLocal]');

               res.status(200).json({ success: true, message: 'Data inserted successfully' });
    }catch(err){
                console.error(err);
                res.status(500).json({ success: false, message: 'Server error', error: err.message });
 
    }


});

app.post('/UpdateStatus', async (req, res) => {
    const { RefLine } = req.body; // ✅ FIXED
    console.log("Received RefLine Updated:", RefLine);

    try {
        const pool = await sql.connect(config);
        const result = await pool.request()
            result.input('RefID', sql.BigInt, RefLine) // Use correct SQL param name
            result.execute('H_UpdateStatusInHistorytbl');

        res.json(result.recordset);
    } catch (err) {
        console.error("Error occurred:", err);
        res.status(500).send('Database Error');
    }
}); // update status 



app.post('/ActChecker', async (req, res) => {

 
    const { UserID, MStat } = req.body;
    try {
        const pool = await sql.connect(config);

        const result = await pool.request()
            .input('User', sql.VarChar(20), UserID)
            .input('Stat', sql.VarChar(20), MStat)
            .execute('H_UserTranChecker');

        res.json(result.recordset);
    } catch (err) {
        console.error("Error occurred", err);
        res.status(500).send('Database Error');
    }
});// checker for transactions

 

app.get('/UserLogin', async (req,res) =>{
    try {
        const pool = await sql.connect(config);
        const result = await pool.request().query('select Line, Mbl_UserID, Mbl_Pass from TabUsers');
        res.json(result.recordset);
         
    } catch (err) {
        console.error(err);
        res.status(500).send('Database Error');
    }

}); // login importation API


app.get('/Billing', async (req,res) =>{
    try {
        const pool = await sql.connect(config);
        const result = await pool.request().query('SELECT Line, Trno, RLine, MStat, CBUsed, DueDte, CAmt, AA, BalAmt, Rem,WMNo FROM H_tblBilling');
        res.json(result.recordset);
         
    } catch (err) {
        console.error(err);
        res.status(500).send('Database Error');
    }

}); // Billing importation API




app.post('/UserTranCnt', async (req, res) => {

 
    const { UserID, MStat } = req.body;
    try {
        const pool = await sql.connect(config);

        const result = await pool.request()
            .input('user', sql.VarChar(20), UserID)
            .input('CurDteRead', sql.VarChar(20), MStat)
            .execute('H_UserTranRecord');

        res.json(result.recordset);
    } catch (err) {
        console.error("Error occurred", err);
        res.status(500).send('Database Error');
    }
});// checker for transactions



app.post('/PerBatchUpload', async (req,res) => {
    try{
            const pool = await sql.connect(config);
            const tvp = new sql.Table("PrevReadTableType");
            tvp.columns.add("WMNo", sql.VarChar(20));
            tvp.columns.add("PR_Type", sql.VarChar(20));
            tvp.columns.add("MStat", sql.VarChar(20));
            tvp.columns.add("PrevMRead", sql.BigInt);
            tvp.columns.add("PrevDteRead", sql.DateTime);
            tvp.columns.add("CurMRead", sql.BigInt);
            tvp.columns.add("CurDteRead", sql.DateTime);
            tvp.columns.add("CBUsed", sql.BigInt);
            tvp.columns.add("DueDte", sql.DateTime);
            tvp.columns.add("dteDC", sql.DateTime);
            tvp.columns.add("CAmt", sql.BigInt);
            tvp.columns.add("RefLine", sql.BigInt);
            tvp.columns.add("UserID", sql.VarChar(20));


            req.body.forEach(item => {
               tvp.rows.add(
                        item.WMNo,
        item.PRType,
        item.MStat,
        item.PrevMRead,
        new safeDate(item.PrevDteRead),
        item.CurMRead,
        new safeDate(item.CurDteRead),
        item.CBUsed,
        new safeDate(item.DueDte),
        new safeDate(item.dteDC),
        item.CAmt,
        item.RefLine,
        item.UserID


               ); 
            });


            await pool.request().input("PrevReadRecordsBatch",tvp)
            .execute("H_InsertToPrevReadFromLocal_perBatch");

            res.json({success : true, message: "Batch insert successfully"});

    }catch (err){

        console.error(err);
        res.status(500).json({success: false, error: err.message});
    }



});



function safeDate(value) {
  if (!value) return null;  // handles null, undefined, empty string
  const d = new Date(value);
  return isNaN(d.getTime()) ? null : d;
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

