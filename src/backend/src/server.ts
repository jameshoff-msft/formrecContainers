process.env['NODE_CONFIG_DIR'] = __dirname + '/configs';

import 'dotenv/config';
import App from '@/app';
import IndexRoute from '@routes/index.route';
import FileRoute from '@routes/file.route';
import LayoutRoute from '@routes/layout.route';
import BlobRoute from '@routes/blobStorage.route';
import CustomRoute from '@routes/custom.route';
import InvoiceRoute from '@routes/prebuiltInvoice.route'
import ReceiptRoute from '@routes/prebuiltReceipt.route'
import BusinessCardRoute from './routes/prebuiltBusinessCard.route';
import IdRoute from './routes/prebuiltId.route'
import validateEnv from '@utils/validateEnv';

validateEnv();

const app = new App([new IdRoute(), new BusinessCardRoute(), new InvoiceRoute(), new ReceiptRoute(), new FileRoute(), new LayoutRoute(), new BlobRoute(), new CustomRoute()]);

app.listen();

// import express from "express"
// var app       =     express();
// app.use('/docs',express.static(__dirname + '/public'));
// app.listen(3300,()=>{
//     console.log("listening")
// })
