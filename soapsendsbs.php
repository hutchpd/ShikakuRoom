<?php

$sURL = "https://www.sbs-claims.co.uk/SupplierOrdering/Service1.svc?wsdl";
$sXML = '<OrderAccepted xmlns="http://tempuri.org/">
            <order xmlns:d4p1="http://schemas.datacontract.org/2004/07/SupplierOrderingWCF" xmlns:i="http://www.w3.org/2001/XMLSchema-instance">
                <d4p1:DeliveryDate>true</d4p1:DeliveryDate>
                <d4p1:GUID>de5ea989-5b87-4761-abaa-5b858e99d2f0</d4p1:GUID>
                <d4p1:PriceCorrect>true</d4p1:PriceCorrect>
                <d4p1:PurchaseOrderNumber>703100</d4p1:PurchaseOrderNumber>
                <d4p1:StockCorrect>true</d4p1:StockCorrect>
                <d4p1:SupplierName>MR Systems</d4p1:SupplierName>
            </order>
        </OrderAccepted>';

// create soap connection with trace settings
$option=array("trace"=>1);
$soapClient = new SoapClient($sURL,$option);

try {
    // create soapVar with xml string
    $aToSend = array(new SoapVar(trim($sXML),XSD_ANYXML)); 
    // post OrderAccepted message to wsdl
    $result = $soapClient->OrderAccepted(new SoapVar($sXML,XSD_ANYXML));
    // get soap response from client
    $sResponse = $soapClient->__getLastResponse();
    echo $sResponse;
} catch (Exception $e) {
    $message = $e->getMessage();
    echo $message;
    echo "\n\n";
    // display soap message that was sent
    echo $soapClient->__getLastRequest();
    echo "\n\n";
    // display soap message received
    echo $soapClient->__getLastResponse();
}
?>
