export enum ERecordType {
    DRAFT = '0',
    SIGN_AND_SEND = '1',
}

export enum SearchType {
    STATUS = '1',
    E_RECORD = '2',
}

export enum HSMtype {
    WAITING = 'waiting',
    UPDATE = 'update',
    SEND = 'send',
    CREATE = 'create',
    CLOSE = 'close',
    CREATE_ERECORD = 'create-erecord',
    EDIT_ERECORD = 'edit-erecord',
    NEW_INVOICE = 'new-invoice',
    E_INVOICE = 'e-invoice',
    CREATE_SEARCH = 'create-search',
    SEND_DECLARATION = 'send-declaration',
    MAKE_DECLARATION = 'make-declaration',
    CREATE_REQUEST_TO_CHANGE = 'create-request-to-change',
    SEND_REQUEST_TO_CHANGE = 'send-request-to-change',
}

export enum CommonCode {
    FORM_NO = 'WT0010',
    PAYMENT_TYPE = 'WT0200',
    VAT_RATE = 'WT0180',
    FEATURE = 'WT0230',
    DECLARATION_NAME = 'WT0040',
    FORM_NO_DECLARATION = 'WT0030',
    SYMBOL_TYPE = 'WT0150',
    XML_VS = 'WT0140',
    FORM_TP = 'WT0090',
    TEMPLATE_ID_TYPE = 'WT0280',
    INVOICE_TYPE = 'WT0020',
    TEMPLATE_STATUS = 'WT0320',
    NOTI_FEATURE = 'WT0130',
    NOTI_TYPE = 'WT0110',
    CURRENCY = 'WT0160',
    APP_TYPE = "WT0120",
    ADJUST_TYPE = "WT0290",
    CERTIFICATE_TYPE = "WT0390",
    HSM_SERVICE_PROVIDER = "WT0400"
}

export enum SettingNavEnum {
    MyAccount = "My Account",
    Company = "Company",
    Shop = "Shop",
    Declaration = "Declaration",
    DigitalSignature = "Digital Signature",
    eInvoiceTemplate = " Template",
    Items = "Items",
    UserManagement = "User Management"
}

// export enum ImportDeclDataType {
//     IMPORT = 'IMPORT',
//     ADD = 'ADD',
// }

export enum SaveDeclaration{
    GENERATE = 'GENERATE',
    DRAFT = 'DRAFT',
    UPDATE = 'UPDATE',
}

export enum ETaxResult{
    REPORTED = "Y",
    NOT_REPORTED = "N",
}

export enum CQTStatus{
    SENT= "3",
    NOT_RECEIVED = "4",
    ACCEPT = "5",
    REJECT = "6",
    DRAFT = "D",
}

export enum OpenFormType{
    VIEW = 'VIEW',
    CREATE = 'CREATE',
    EDIT = 'EDIT',
}

export enum TemplateType {
    SINGLE_VAT_RATE = "1000000111",
    MULTI_VAT_RATE = "1000000121",
}

export enum EmailStatus {
    SENT = "1",
    NOT_SENT = "0",
    FAILED = "2",
    IN_PROGRESS = "3",
}

export enum eRecordStatus {
    SENT = "1",
    ERROR = "2",
    SIGNED = "3",
}

export enum SymbolType {
    POS_INVOICE = "M",
    NORMAL_INVOICE = "T",
}

export enum InformType {
    CANCEL = "1",
    ADJUST = "2",
    REPLACE = "3",
    // EXPLAIN = "4",
    // GENERAL_ERROR = "5",
}

export enum InvoiceType {
    ORIGINAL = "O",
    CANCELED = "1",
    REPLACED = "2",
    ADJUSTED = "3",
    REPLACEMENT = "6",
    ADJUSTMENT = "7",
    DRAFT = "D",
}

export enum FeatureType {
    NOTES = "4",
}

export enum NavbarEnum {
    CUSTOMER = "Customers",
    SALE = "Sales",
    REPORT = "Reports",
}

export enum NavbarPathEnum {
    CUSTOMER = '/customers',
    SALE = '/sale/pos-invoice',
    REPORT = '/reports',
    STATUS = '/status',
    SALE_STATUS = '/sale/status',
    E_INVOICE = '/sale/e-invoice',
    PARKING = '/sale/parking',
    SALE_REQUEST_TO_CHANGE = '/sale/request-to-change',
    E_INVOICE_CANCEL = '/sale/e-invoice/cancel',
    E_INVOICE_ADJUST = '/sale/e-invoice/adjust',
    E_INVOICE_REPLACE = '/sale/e-invoice/replace',
}

export enum SessionStorageKey {
    E_INVOICE_STATUS = 'eInvoiceStatus',
    POS_INVOICE = 'posInvoice-options',
    E_INVOICE_STATUS_DEFAULT = 'eInvoiceStatus-default-options',
    E_INVOICE_STATUS_All = 'eInvoiceStatus-all-options',
    E_INVOICE = 'eInvoice-options',
    PARKING = 'parking-options',
    SHOPS = 'shops-options',
    CUSTOMERS = 'customers-options',
    DIGITAL_SIGNATURE = 'digitalSignature-options',
    DECLARATIONS = 'declaration-options',
}

export enum ProductSource {
    AUTO = "AUTO",
    MANUAL = "MANUAL",
    POS_IMPORT = "POS_IMPORT",
    WABOOK_IMPORT = "WABOOK_IMPORT",
}

export enum Roles {
    ADMIN = "ADMIN",
    USER = "USER",
}

export enum CERTIFICATE_TYPE {
    USB_TOKEN = "1",
    HSM = "2",
}

export enum YesOrNo {
    YES = "Y",
    NO = "N",
}