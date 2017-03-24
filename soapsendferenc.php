<?php

$sURL = "https://www.sbs-claims.co.uk/SupplierOrdering/Service1.svc?wsdl";


$sXML = '<InvoiceSent xmlns="http://tempuri.org/">
<order xmlns:d4p1="http://schemas.datacontract.org/2004/07/SupplierOrderingWCF" xmlns:i="http://www.w3.org/2001/XMLSchema-instance">
<d4p1:CustomerDetails>
<d4p1:Address>SBS Insurance Services BEECROFT ROAD UK WS111JP</d4p1:Address>
<d4p1:ContactNumber i:nil="true"/>
<d4p1:Name>MR. S ROWLAND</d4p1:Name>
</d4p1:CustomerDetails><d4p1:DeliveryAddress>
<d4p1:Address>SBS Insurance Services BEECROFT ROAD UK WS111JP</d4p1:Address>
<d4p1:PostCode></d4p1:PostCode >
<d4p1:ContactNumber i:nil="true"/>
<d4p1:Name>Mr. S Rowland</d4p1:Name>
</d4p1:DeliveryAddress><d4p1:DeliveryDate>2014-11-06T00:00:00</d4p1:DeliveryDate>
<d4p1:DeliveryPrice>107.7</d4p1:DeliveryPrice>
<d4p1:DeliveryVAT>0</d4p1:DeliveryVAT>
<d4p1:GUID>de5ea989-5b87-4761-abaa-5b858e99d2f0</d4p1:GUID>
<d4p1:InvoiceNumber>10241418</d4p1:InvoiceNumber>
<d4p1:InvoiceTotal>107.7</d4p1:InvoiceTotal>
<d4p1:OrderDate>2014-11-04T00:00:00</d4p1:OrderDate><d4p1:ProductOrdered><d4p1:ProductOrdered>
<d4p1:GUID>de5ea989-5b87-4761-abaa-5b858e99d2f0</d4p1:GUID>
<d4p1:DeliveryPrice>107.7</d4p1:DeliveryPrice>
<d4p1:MPNCode>2116695</d4p1:MPNCode>
<d4p1:Price>107.7</d4p1:Price>
<d4p1:ProductDescription>Samsung UE22H5000AKXXU 22  LED TV</d4p1:ProductDescription>
<d4p1:Quantity>1</d4p1:Quantity>
<d4p1:VAT>0</d4p1:VAT>
</d4p1:ProductOrdered></d4p1:ProductOrdered><d4p1:PurchaseOrderNumber>721664</d4p1:PurchaseOrderNumber>
<d4p1:SupplierName>Misco UK Limited</d4p1:SupplierName>
<d4p1:TotalVAT>0</d4p1:TotalVAT></order>
</InvoiceSent>';
 
// create soap connection with trace settings
$option=array("trace"=>1);
$soapClient = new SoapClient($sURL,$option);

try {
    // create soapVar with xml string
    $aToSend = array(new SoapVar(trim($sXML),XSD_ANYXML)); 
    // post OrderAccepted message to wsdl
    $result = $soapClient->InvoiceSent(new SoapVar($sXML,XSD_ANYXML));
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

