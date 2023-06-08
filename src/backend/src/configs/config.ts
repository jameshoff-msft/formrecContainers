import fs from "fs"


const config = {
    "ID_HOSTNAME" : process.env["ID_HOSTNAME"] || "id-formrec-id",
    "ID_PORT" : process.env["ID_PORT"] || "8080",
    "BUSINESSCARD_HOSTNAME" : process.env["BUSINESSCARD_HOSTNAME"] || "businesscard-formrec-businesscard",
    "BUSINESSCARD_PORT" : process.env["BUSINESSCARD_PORT"] || "8080",
    "INVOICE_HOSTNAME" : process.env["INVOICE_HOSTNAME"] || "invoice-formrec-invoice",
    "INVOICE_PORT" : process.env["INVOICE_PORT"] || "8080",
    "RECEIPT_HOSTNAME" : process.env["RECEIPT_HOSTNAME"] || "receipt-formrec-receipt",
    "RECEIPT_PORT" : process.env["RECEIPT_PORT"] || "8080",
    "LAYOUT_HOSTNAME" : process.env["LAYOUT_HOSTNAME"] || "layout-formrec-layout",
    "LAYOUT_PORT" : process.env["LAYOUT_PORT"] || "8080",
    "CUSTOM_HOSTNAME" : process.env["CUSTOM_HOSTNAME"] || "customapi-formrec-customapi",
    "CUSTOM_PORT" : process.env["CUSTOM_PORT"] || "8080"
}

export default config